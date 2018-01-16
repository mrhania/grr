'use strict';

goog.provide('grrUi.forms.autoGeneratedAes128KeyFormDirectiveTest');
goog.require('grrUi.forms.autoGeneratedAES128KeyFormDirective.generateRandomBytes');
goog.require('grrUi.forms.module');
goog.require('grrUi.tests.browserTrigger');
goog.require('grrUi.tests.module');

var browserTrigger = grrUi.tests.browserTrigger;

describe('grr-form-auto-generated-aes128key form directive', function() {

  beforeEach(function() {
    var i = 0;
    var step = 1.0 / 16;

    spyOn(Math, 'random').and.callFake(function() {
      var result = step * i + step / 2;

      if (++i >= 16) {
        i = 0;
      }

      return result;
    });
  });

  describe('generateRandomBytes()', function() {
    var generateRandomBytes =
        grrUi.forms.autoGeneratedAES128KeyFormDirective.generateRandomBytes;

    it('correctly generates 4-bytes string', function() {
      expect(generateRandomBytes(4)).toBe('01234567');
    });

    it('correctly generates 16 bytes string', function() {
      expect(generateRandomBytes(16)).toBe(
          '0123456789abcdef0123456789abcdef');
    });
  });

  var $compile, $rootScope, value;

  beforeEach(module('/static/angular-components/forms/' +
      'auto-generated-aes128-key-form.html'));
  beforeEach(module(grrUi.forms.module.name));
  beforeEach(module(grrUi.tests.module.name));

  grrUi.tests.stubDirective('grrFormPrimitive');

  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
  }));

  var renderTestTemplate = function(value) {
    $rootScope.value = value;

    var template = '<grr-form-auto-generated-aes128-key value="value" />';
    var element = $compile(template)($rootScope);
    $rootScope.$apply();

    return element;
  };

  it('delegates rendering to grr-form-primitive', function() {
    var element = renderTestTemplate({
      type: 'AutoGeneratedAES128Key',
      value: ''
    });

    var directive = element.find('grr-form-primitive');
    expect(directive.length).toBe(1);
  });

  it('prefills auto-generated key if value is empty', function() {
    var element = renderTestTemplate({
      type: 'AutoGeneratedAES128Key',
      value: ''
    });
    expect($rootScope.value.value).toBe('0123456789abcdef0123456789abcdef');
  });

  it('preserves value if it\'s set', function() {
    var element = renderTestTemplate({
      type: 'AutoGeneratedAES128Key',
      value: 'blah'
    });
    expect($rootScope.value.value).toBe('blah');
  });
});
