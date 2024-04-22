
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Penwin extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
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
    this.wing.rotation.y = 90;
    this.wing.position.set(0, 0, -0.2);

    this.wing2 = new THREE.Mesh(this.winggeo, this.blackmaterial);
    this.wing2.rotation.y = -90;
    this.wing2.position.set(0, 0, 0.2);


    // Torso
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
    
    this.add(this.torso);
    this.add(this.beak);
    this.add(this.eye);
    this.add(this.eye2);
    this.add(this.belly);
    this.add(this.foot);
    this.add(this.foot2);
    this.add(this.wing);
    this.add(this.wing2);
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

}

export { Penwin }
