function escapeShellArg(str) {
  return str.replace(/'/g, "'\\''");
}

function compileTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, function (_, key) {
    if (Object.prototype.hasOwnProperty.call(values, key) && values[key] != null) {
      return String(values[key]);
    }
    return '';
  });
}

function normalizeWhitespace(text) {
  return text.replace(/[\s\u00A0]+/g, ' ').trim();
}

function buildNote(input, options) {
  var selection = input && input.text ? input.text : '';
  if (!selection) {
    throw new Error('没有可用的选中文本');
  }

  var deck = normalizeWhitespace(options.deckName || 'Default');
  var model = normalizeWhitespace(options.modelName || 'Basic');
  var frontField = normalizeWhitespace(options.frontField || 'Front');
  var backField = normalizeWhitespace(options.backField || 'Back');

  if (!deck) {
    throw new Error('请在扩展设置中指定目标牌组');
  }

  if (!model) {
    throw new Error('请在扩展设置中指定笔记类型');
  }

  if (!frontField) {
    throw new Error('前面字段名称不能为空');
  }

  var context = popclip.context || {};
  var source = context.browserUrl || context.url || context.windowTitle || context.appName || '';

  var templateValues = {
    selection: selection,
    source: source
  };

  var backContent = '';
  if (options.backTemplate && options.backTemplate.length > 0) {
    backContent = compileTemplate(options.backTemplate, templateValues).trim();
  }

  var fields = {};
  fields[frontField] = selection;
  if (backField && backContent) {
    fields[backField] = backContent;
  }

  var tags = [];
  if (options.additionalTags) {
    tags = options.additionalTags
      .split(/[\s,]+/)
      .map(function (tag) { return tag.trim(); })
      .filter(function (tag) { return tag.length > 0; });
  }

  return {
    action: 'addNote',
    version: 6,
    params: {
      note: {
        deckName: deck,
        modelName: model,
        fields: fields,
        tags: tags,
        options: {
          allowDuplicate: Boolean(options.allowDuplicate),
          duplicateScope: 'deck'
        }
      }
    }
  };
}

exports.actions = {
  sendToAnki: async function (input, options) {
    options = options || popclip.options || {};
    try {
      var payload = buildNote(input, options);
      var json = JSON.stringify(payload);
      var command = "/usr/bin/env curl -sS -X POST -H 'Content-Type: application/json' -d '" + escapeShellArg(json) + "' http://localhost:8765";
      var responseText = await popclip.shellCommand(command, { timeout: 5 });
      if (!responseText) {
        throw new Error('未能从 AnkiConnect 获得响应');
      }
      var response = JSON.parse(responseText);
      if (response.error) {
        throw new Error('AnkiConnect 返回错误：' + response.error);
      }
      popclip.showSuccess('已添加到 Anki');
    } catch (error) {
      popclip.showError(error.message || String(error));
      throw error;
    }
  }
};
