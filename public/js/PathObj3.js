class PathObj3 {
  constructor({path, pathData = {}, id,  name, scene, type = 'none',  showDots = false, zIndex = 10, group, visible = true,
    fillColor = 0x000000,
    position = {x:0, y:0, z:0},
    rotation = {x:0, y:0, z:0},
    scale = {x:1, y:1, z:1}}
  ) {
    this.id = -1;
    this.scene = scene;
    this.group = group;
    this.props = {
      id,
      name,
      zIndex,
      fillColor,
      position,
      type,
      showDots,
      pathData,
      rotation,
      scale,
      visible
    }
    if(pathData && !path) {
      if(type === 'custom-geometry') {
        const material = new THREE.MeshBasicMaterial( { morphTargets: true, color : new THREE.Color(parseInt(this.props.fillColor)), side:THREE.DoubleSide} );
        const geometry = new THREE.ParametricGeometry((u, v, target) => {
            var x = u * pathData.height;
            var z = 0;
            var y = v * pathData.width;
            target.set(x, y, z);
        }, 1, pathData.segments);
        this.path = new THREE.Mesh( geometry, material );
      } else if(type === 'Line') {
        const line = new THREE.Path();
      	line.moveTo( pathData.vertices[0].x, pathData.vertices[0].y );
      	line.lineTo( pathData.vertices[1].x, pathData.vertices[1].y );
        const geometry = new THREE.Geometry().setFromPoints( line.getPoints() );
        const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
        this.path = new THREE.Line( geometry, material );
      } else {
        var loader = new THREE.ObjectLoader();
        loader.parse(JSON.parse(pathData), (obj) => {
            this.path = obj;
        });
      }
    } else {
      this.path = path;
    }
    this.init();
    this.scene.add(this.path);
    this.formZindexes();
    this.formDots();
  }

  init() {
    const {position, rotation, path, type, pathData, visible} = this.props;
    if(type === 'custom-geometry' || type === 'Line') {
      this.path.geometry.vertices.forEach((v, index) => {
        const p = pathData.vertices[index];
        v.set(p.x, p.y, p.z);
      });
      this.path.geometry.verticesNeedUpdate = true;
    }
    if(type !== 'Line') {
      this.path.geometry.center();
    } else {

    }
    this.path.position.x = position.x;
    this.path.position.y = position.y;
    this.path.position.z = position.z;

    this.path.rotation.x = rotation.x;
    this.path.rotation.y = rotation.y;
    this.path.rotation.z = rotation.z;

    this.path.visible = visible;
  }

  formDots() {
    if(this.props.type === 'custom-geometry' || this.props.type === 'Line') {
      if(this.path.geometry.vertices.length > this.path.children.length && this.props.showDots) {
        this.path.geometry.vertices.forEach((point, index) => {
            const materialp = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});
            var spGeom = new THREE.SphereGeometry(3);
            var spMesh = new THREE.Mesh(spGeom, materialp);
            spMesh.name = index;
            spMesh.position.copy(point);
            this.path.add(spMesh);
        });
      } else {
        this.path.children.forEach(dot => dot.visible = this.props.showDots);
      }
    }
  }

  getPointAt(val) {
    if(this.curve) {
      return this.curve.getPointAt(val);
    } else if(this.props.type === 'Line') {
      const line = new THREE.Path();
    	line.moveTo( this.path.geometry.vertices[0].x, this.path.geometry.vertices[0].y );
    	line.lineTo( this.path.geometry.vertices[1].x, this.path.geometry.vertices[1].y );
    	this.curve = line;
      return this.curve.getPointAt(val);
    } else {
      return null;
    }
  }

  remove() {
    if(this.group) {
      let index = -1;
      this.group.children.find((child, i) => {
        if(child === this.path) {
          index = i;
        }
      });
      this.group.remove(this.path);
    }
    this.scene.remove(this.path);
  }

  formZindexes() {
    this.path.position.z = this.props.zIndex;
  }

  setGroup(group) {
    this.group = group;
    this.group.add(this.path);
  }

  setProps(props) {
    this.props = Object.assign({}, this.props, props);
    this.path.material.color = new THREE.Color(parseInt(this.props.fillColor));
    this.path.visible = this.props.visible;
    this.formZindexes();
    this.formDots();
  }

  setPosition(position) {
    this.path.position.x = position.x;
    this.path.position.y = position.y;
  }

  getProperties() {
    if(this.props.type === 'custom-geometry' || this.props.type === 'Line') {
      this.props.pathData.vertices = this.path.geometry.vertices.map(v => {
        return {
          x:v.x,
          y:v.y,
          z:v.z
        }
      });
    } else {
      this.props.pathData = JSON.stringify(this.path.toJSON())
    }
    this.props = Object.assign({}, this.props, {
      position:{
        x:this.path.position.x,
        y:this.path.position.y,
        z:this.path.position.z
      },
      rotation:{
        x:this.path.rotation.x,
        y:this.path.rotation.y,
        z:this.path.rotation.z
      },
      scale:{
        x:this.path.scale.x,
        y:this.path.scale.y,
        z:this.path.scale.z
      },
      zIndex:this.path.position.z,
      fillColor:'0x'+this.path.material.color.getHexString(),
      visible:this.path.visible
    });
    return this.props;
  }

  getPathData() {
    if(this.props.type === 'custom-geometry' || type === 'Line') {
      this.props.pathData.vertices = this.path.geometry.vertices.map(v => {
        return {
          x:v.x,
          y:v.y,
          z:v.z
        }
      });
    } else {
      this.props.pathData = JSON.stringify(this.path.toJSON())
    }
    return this.props.pathData;
  }

  setVertex(segment, point, options) {
    segment.position.x += point.x;
    segment.position.y += point.y;
    this.path.geometry.vertices[segment.name].x += point.x;
    this.path.geometry.vertices[segment.name].y += point.y;
    this.path.geometry.verticesNeedUpdate = true;
    this.curve = null;
  }

  getAngle() {
    return this.path.rotation.z;
  }

  rotatePath(angle) {
    this.path.rotation.z = angle;
  }
}

window.animaticonObjects.PathObj3 = PathObj3;
