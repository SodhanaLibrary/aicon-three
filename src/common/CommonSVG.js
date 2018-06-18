import React from 'react';
export default class  CommonSVG {
  constructor(svgObj, scope) {
    this.scope = scope;
    this.group = new this.scope.Group();
    this.group.addChild(svgObj);
    this.id = -1;
  }

  setId(id) {
    this.id = id;
  }

  getControls() {
    return [];
  }
}
