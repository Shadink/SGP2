
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Penwin extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    this.angle = 0;
    
    this.footMovingUp = true;
    this.bonusanim = false;
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    
    this.hurt = false;

    this.blackmaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    this.orangematerial = new THREE.MeshStandardMaterial( { color: 0xF7A80A });
    this.whitematerial = new THREE.MeshStandardMaterial( { color : 0xFFFFFF });

    // Wings
    this.wingshape = new THREE.Shape();
    
    this.wingshape.moveTo(0, 0.1);
    this.wingshape.quadraticCurveTo(0.2, 0, 0.4, 0.5);
    this.wingshape.quadraticCurveTo(0.5, -0.05, 0, -0.1);
    this.wingshape.lineTo(0, 0.1);

    this.bonuswingshape = new THREE.Shape();

    this.bonuswingshape.moveTo(0, 0.1);
    this.bonuswingshape.quadraticCurveTo(0.2, 0, 0.3, 0.3);
    this.bonuswingshape.quadraticCurveTo(0.25, 0.35, 0.3, 0.4);
    this.bonuswingshape.lineTo(0.3, 0.6);
    this.bonuswingshape.quadraticCurveTo(0.35, 0.58, 0.4, 0.5);
    this.bonuswingshape.quadraticCurveTo(0.45, 0.475, 0.5, 0.4);
    this.bonuswingshape.quadraticCurveTo(0.5, -0.05, 0, -0.1);
    this.bonuswingshape.lineTo(0, 0.1);

    this.options = { depth: 0.01, steps: 2, bevelEnabled: false};
    this.winggeo = new THREE.ExtrudeGeometry(this.wingshape, this.options);
    this.bonuswinggeo = new THREE.ExtrudeGeometry(this.bonuswingshape, this.options);

    this.wing = new THREE.Mesh(this.winggeo, this.blackmaterial);
    this.wing.rotation.y = (90 * Math.PI) / 180;
    this.wing.position.set(0, 0, -0.2);
    this.bonuswing = new THREE.Mesh(this.bonuswinggeo, this.blackmaterial);
    this.bonuswing.rotation.y = (90 * Math.PI) / 180;
    this.bonuswing.position.set(0, 0, -0.2);

    this.wing2 = new THREE.Mesh(this.winggeo, this.blackmaterial);
    this.wing2.rotation.y = (-90 * Math.PI) / 180;
    this.wing2.position.set(0, 0, 0.2);
    this.bonuswing2 = new THREE.Mesh(this.bonuswinggeo, this.blackmaterial);
    this.bonuswing2.rotation.y = (-90 * Math.PI) / 180;
    this.bonuswing2.position.set(0, 0, 0.2);

    //Torso
    this.torsogeo = new THREE.CylinderGeometry(0, 0.5, 1, 20);
    this.torso = new THREE.Mesh(this.torsogeo, this.blackmaterial);

    //Beak
    this.beakgeo = new THREE.SphereGeometry(0.1, 10, 10);
    this.beak = new THREE.Mesh(this.beakgeo, this.orangematerial);
    this.beak.scale.set(1, 0.5, 1);
    this.beak.position.set(0.15, 0.2, 0);

    //Eyes
    this.eyegeo = new THREE.SphereGeometry(0.025, 10, 10);
    this.eye = new THREE.Mesh(this.eyegeo, this.whitematerial);
    this.eye.position.set(0.1, 0.3, 0.05);
    this.eye2 = new THREE.Mesh(this.eyegeo, this.whitematerial);
    this.eye2.position.set(0.1, 0.3, -0.05);

    //Belly
    this.bellygeo = new THREE.SphereGeometry(0.25, 10, 10);
    this.belly = new THREE.Mesh(this.bellygeo, this.whitematerial);
    this.belly.position.set(0.2, -0.25, 0);

    //Feet
    this.footgeo = new THREE.BoxGeometry(0.3, 0.1, 0.25);
    this.foot = new THREE.Mesh(this.footgeo, this.orangematerial);
    this.foot.position.set(0, -0.6, -0.2);
    this.foot2 = new THREE.Mesh(this.footgeo, this.orangematerial);
    this.foot2.position.set(0, -0.6, 0.2);
    
    // Camara
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    this.camera.position.set(0,0.8,-1.25);
    this.camera.rotation.y = (-180 * Math.PI) / 180;

    this.modifiedpenwin = new THREE.Scene();

    this.modifiedpenwin.scale.set(0.25, 0.25, 0.25);
    this.modifiedpenwin.position.set(0, 0.65, 0);
    this.modifiedpenwin.rotation.y = (270 * Math.PI) / 180;

    this.pointlight = new THREE.PointLight(0xffffff, 0);

    this.modifiedpenwin.add(this.torso);
    this.modifiedpenwin.add(this.beak);
    this.modifiedpenwin.add(this.eye);
    this.modifiedpenwin.add(this.eye2);
    this.modifiedpenwin.add(this.belly);
    this.modifiedpenwin.add(this.foot);
    this.modifiedpenwin.add(this.foot2);
    this.modifiedpenwin.add(this.wing);
    this.modifiedpenwin.add(this.wing2);
    this.modifiedpenwin.add(this.pointlight);

    this.modifiedpenwinwcam = new THREE.Scene();

    this.modifiedpenwinwcam.add(this.modifiedpenwin);
    this.modifiedpenwinwcam.add(this.camera);

    this.modifiedpenwinz = new THREE.Scene();

    this.modifiedpenwinz.add(this.modifiedpenwinwcam)
    this.modifiedpenwinz.rotation.z = (0 * Math.PI) / 180;

    this.add(this.modifiedpenwinz);

  }

  turnLightOn(){
    this.pointlight.intensity = 1;
  }

  turnLightOff(){
    this.pointlight.intensity = 0;
  }

  bonusAnimOn(){
    this.bonusanim = true;
    this.turnLightOn();
    this.modifiedpenwin.rotation.x = (45 * Math.PI) / 180;
    this.foot.position.set(0, -0.7, -0.2);
    this.foot.rotation.z = (90 * Math.PI) / 180;
    this.foot2.position.set(0, -0.7, 0.2);
    this.foot2.rotation.z = (90 * Math.PI) / 180;
    this.modifiedpenwin.remove(this.wing);
    this.modifiedpenwin.remove(this.wing2);
    this.modifiedpenwin.add(this.bonuswing);
    this.modifiedpenwin.add(this.bonuswing2);
  }

  bonusAnimOff(){
    this.bonusanim = false;
    this.turnLightOff();
    this.modifiedpenwin.rotation.x = 0;
    this.foot.position.set(0, -0.6, -0.2);
    this.foot.rotation.z = 0;
    this.foot2.position.set(0, -0.6, 0.2);
    this.foot2.rotation.z = 0;
    this.modifiedpenwin.remove(this.bonuswing);
    this.modifiedpenwin.remove(this.bonuswing2);
    this.modifiedpenwin.add(this.wing);
    this.modifiedpenwin.add(this.wing2);
  }
  hurtPenwin(){
    this.hurt = true;
  }

  isHurt(){
    return this.hurt;
  }

  changeAngle(increment){
    this.remove(this.modifiedpenwinz);
    this.modifiedpenwinz.rotation.z += increment;
    this.add(this.modifiedpenwinz);
  }
  
  createGUI (gui,titleGui) {

    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {

      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {

      }
    } 

    //Resetear
    var reset = gui.addFolder ("Resetear");
    reset.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    if(this.hurt){
      this.modifiedpenwin.rotation.y += (4 * Math.PI) / 180;
      if(this.modifiedpenwin.rotation.y >= (630*Math.PI)/180){
        this.hurt = false;
        this.modifiedpenwin.rotation.y = (270*Math.PI)/180;
      }
    }
    
    if(!this.bonusanim){
      if(this.footMovingUp){
        this.foot.position.y += 0.01;
        this.foot2.position.y -= 0.01;
        if(this.foot.position.y >= -0.55){
          this.footMovingUp = false;
        }
      } else {
        this.foot.position.y -= 0.01;
        this.foot2.position.y += 0.01;
        if(this.foot.position.y <= -0.65){
          this.footMovingUp = true;
        }
      }
    }

  }

  getCamera(){
    return this.camera;
  }

}

export { Penwin }
