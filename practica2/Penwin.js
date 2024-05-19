
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Penwin extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    this.angle = 0;
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    

    this.blackmaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.orangematerial = new THREE.MeshBasicMaterial( { color: 0xF7A80A });
    this.whitematerial = new THREE.MeshBasicMaterial( { color : 0xFFFFFF });

    // Wings
    this.wingshape = new THREE.Shape();
    
    this.wingshape.moveTo(0, 0.1);
    this.wingshape.quadraticCurveTo(0.2, 0, 0.4, 0.5);
    this.wingshape.quadraticCurveTo(0.5, -0.05, 0, -0.1);
    this.wingshape.lineTo(0, 0.1);

    this.options = { depth: 0.01, steps: 2, bevelEnabled: false};
    this.winggeo = new THREE.ExtrudeGeometry(this.wingshape, this.options);
    this.wing = new THREE.Mesh(this.winggeo, this.blackmaterial);
    this.wing.rotation.y = (90 * Math.PI) / 180;
    this.wing.position.set(0, 0, -0.2);

    this.wing2 = new THREE.Mesh(this.winggeo, this.blackmaterial);
    this.wing2.rotation.y = (-90 * Math.PI) / 180;
    this.wing2.position.set(0, 0, 0.2);


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
    this.camera.position.set(-4,0.5,0);
    this.camera.rotation.y = (-90 * Math.PI) / 180;

    this.modifiedpenwin = new THREE.Scene();

    this.modifiedpenwin.scale.set(0.25, 0.25, 0.25);
    this.modifiedpenwin.position.set(0, 0.65, 0);
    this.modifiedpenwin.rotation.y = (270 * Math.PI) / 180;


    this.modifiedpenwin.add(this.torso);
    this.modifiedpenwin.add(this.beak);
    this.modifiedpenwin.add(this.eye);
    this.modifiedpenwin.add(this.eye2);
    this.modifiedpenwin.add(this.belly);
    this.modifiedpenwin.add(this.foot);
    this.modifiedpenwin.add(this.foot2);
    this.modifiedpenwin.add(this.wing);
    this.modifiedpenwin.add(this.wing2);
    this.modifiedpenwin.add(this.camera);

    this.modifiedpenwinz = new THREE.Scene();

    this.modifiedpenwinz.add(this.modifiedpenwin)
    this.modifiedpenwinz.rotation.z = (0 * Math.PI) / 180;

    this.add(this.modifiedpenwinz);

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

  }

  getCamera(){
    return this.camera;
  }

}

export { Penwin }
