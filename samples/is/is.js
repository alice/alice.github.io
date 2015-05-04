var genericTemplate = document.getElementById('GenericTemplate');

function ApplyGenericShadowTo(element) {
  try {
    element
      .createShadowRoot()
      .appendChild(
        document.importNode(
          genericTemplate.content,
          true
        )
      );
  } catch (e) {
    console.warn('Not allowed to create shadow for ' + element.is + ' extending ' + element.parentIs + '.');
  }
}

function RegisterElement(name, extendsName, Parent, proto) {
  var base = Object.create(Parent.prototype);
  
  base.is = name;
  base.parentIs = extendsName;
  Object.getOwnPropertyNames(proto).forEach(function(property) {
    Object.defineProperty(
      base,
      property,
      Object.getOwnPropertyDescriptor(
        proto,
        property
      )
    );
  });
  
  try {
    document.registerElement(name, {
      prototype: base,
      extends: extendsName
    });
  } catch (e) {
    console.warn('Not allowed to register ' + name + ' extending ' + extendsName + '.');
  }
}

function RegisterElementWithGenericShadowTemplate(name, extendsName, Parent) {
  RegisterElement(name, extendsName, Parent, {
    createdCallback: function() {
      ApplyGenericShadowTo(this);
    }
  });
}

var constructorMap = {
  'input': HTMLInputElement,
  'textarea': HTMLTextAreaElement,
  'img': HTMLImageElement,
  'canvas': HTMLCanvasElement,
  'table': HTMLTableElement,
  'a': HTMLAnchorElement,
  'button': HTMLButtonElement,
  'video': HTMLVideoElement,
  'audio': HTMLAudioElement,
  'map': HTMLMapElement
};

var tagMap = {
  'x-text': 'input',
  'x-file': 'input',
  'x-date': 'input',
  'x-submit': 'input',
  'x-checkbox': 'input',
  'x-radio': 'input',
  'x-range': 'input',  
  'x-button-input': 'input',
  'x-textarea': 'textarea',
  'x-img': 'img',
  'x-canvas': 'canvas',
  'x-table': 'table',
  'x-a': 'a',
  'x-button': 'button',
  'x-video': 'video',
  'x-audio': 'audio',
  'x-map': 'map'
};


Object.getOwnPropertyNames(tagMap).forEach(function(customTag) {
  RegisterElementWithGenericShadowTemplate(
    customTag,
    tagMap[customTag],
    constructorMap[tagMap[customTag]]
  );
});

function logEvent(event) {
  console.log(event.type, "event on", event.target.tagName);
}

document.querySelector('button').onclick = logEvent;