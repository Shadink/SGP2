
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Puffin extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    this.wingsUp = false;
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    
    const feathertexture = new THREE.TextureLoader().load( "textures/feathers.jpg" );
    feathertexture.wrapS = THREE.RepeatWrapping;
    feathertexture.wrapT = THREE.RepeatWrapping;
    feathertexture.repeat.set( 2, 2 );

    const featherbumptexture = new THREE.TextureLoader().load( "textures/feathersbump.jpg" );
    featherbumptexture.wrapS = THREE.RepeatWrapping;
    featherbumptexture.wrapT = THREE.RepeatWrapping;
    featherbumptexture.repeat.set( 2, 2 );

    this.blackmaterial = new THREE.MeshStandardMaterial({ color: 0x000000, map: feathertexture, bumpMap: featherbumptexture });
    this.orangematerial = new THREE.MeshStandardMaterial( { color: 0xEB5E34 });
    this.whitefeathermaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: feathertexture, bumpMap: featherbumptexture});
    this.whitematerial = new THREE.MeshStandardMaterial( { color : 0xFFFFFF });

    // Head
    this.headgeo = new THREE.SphereGeometry(0.1, 20, 20);
    this.head = new THREE.Mesh(this.headgeo, this.blackmaterial);
    this.head.position.set(0, 0.4, 0);

    // Beak
    this.beakgeo = new THREE.CylinderGeometry(0.05, 0, 0.2, 10);
    this.beak = new THREE.Mesh(this.beakgeo, this.orangematerial);
    this.beak.position.set(0.125, 0.4, 0);
    this.beak.scale.set(2, 1, 1);
    this.beak.rotation.z = (90 * Math.PI) / 180;

    // Eyes
    this.eyegeo = new THREE.SphereGeometry(0.01, 10, 10);
    this.eye = new THREE.Mesh(this.eyegeo, this.whitematerial);
    this.eye.position.set(0.09, 0.45, 0.05);
    this.eye2 = new THREE.Mesh(this.eyegeo, this.whitematerial);
    this.eye2.position.set(0.09, 0.45, -0.05);

    // Neck
    this.neckgeo = new THREE.TorusGeometry(0.05, 0.01, 9, 9);
    this.neck = new THREE.Mesh(this.neckgeo, this.blackmaterial);
    this.neck.position.set(0, 0.3, 0);
    this.neck.rotation.x = (90 * Math.PI) / 180;

    // Body
    this.bodygeo = new THREE.SphereGeometry(0.3, 10, 20);
    this.body = new THREE.Mesh(this.bodygeo, this.whitefeathermaterial);
    this.body.scale.set(0.5, 1, 0.5);

    // Wings
    this.wingshape = new THREE.Shape();
    
    this.wingshape.moveTo(0, 0.1);
    this.wingshape.quadraticCurveTo(0.2, 0, 0.4, 0.5);
    this.wingshape.quadraticCurveTo(0.5, -0.05, 0, -0.1);
    this.wingshape.lineTo(0, 0.1);

    this.options = { depth: 0.01, steps: 2, bevelEnabled: false};
    this.winggeo = new THREE.ExtrudeGeometry(this.wingshape, this.options);

    this.wings = this.createWings();  
    
    // Feet
    this.footshape = new THREE.Shape();
    
    this.footshape.moveTo(0.05, 0.15);
    this.footshape.lineTo(0.05, -0.05);
    this.footshape.lineTo(0.1, -0.15);
    this.footshape.lineTo(-0.1, -0.15);
    this.footshape.lineTo(-0.05, -0.05);
    this.footshape.lineTo(-0.05, 0.15);
    this.footshape.lineTo(0.05, 0.15);

    this.options = { depth: 0.01, steps: 2, bevelEnabled: false};
    this.footgeo = new THREE.ExtrudeGeometry(this.footshape, this.options);
    this.foot = new THREE.Mesh(this.footgeo, this.orangematerial);
    this.foot.rotation.y = (90 * Math.PI) / 180;
    this.foot.scale.set(0.5, 0.5, 0.5);
    this.foot.position.set(0, -0.32, -0.05);

    this.foot2 = new THREE.Mesh(this.footgeo, this.orangematerial);
    this.foot2.rotation.y = (90 * Math.PI) / 180;
    this.foot2.scale.set(0.5, 0.5, 0.5);
    this.foot2.position.set(0, -0.32, 0.05);

    this.modifiedpuffin = new THREE.Scene();

    this.modifiedpuffin.scale.set(0.25, 0.25, 0.25);
    this.modifiedpuffin.position.set(0, 3, 0);
    this.modifiedpuffin.rotation.z = (-45 * Math.PI) / 180;
    this.modifiedpuffin.rotation.y = (-90 * Math.PI) / 180;

    this.modifiedpuffin.add(this.head);
    this.modifiedpuffin.add(this.beak);
    this.modifiedpuffin.add(this.eye);
    this.modifiedpuffin.add(this.eye2);
    this.modifiedpuffin.add(this.body);
    this.modifiedpuffin.add(this.neck);
    this.modifiedpuffin.add(this.foot2);
    this.modifiedpuffin.add(this.wings);
    this.modifiedpuffin.add(this.foot);
    this.modifiedpuffin.add(this.foot2);

    this.add(this.modifiedpuffin);

  }

  createWings(){
    var wings = new THREE.Object3D();

    this.wing = this.createOneWing(-1);
    this.wing2 = this.createOneWing(1);

    wings.add(this.wing);
    wings.add(this.wing2);

    return wings;
  }

  createOneWing(modifier){

    var wing = new THREE.Mesh(this.winggeo, this.blackmaterial);
    wing.rotation.y = (modifier * 90 * Math.PI) / 180;
    wing.rotation.x = (-180 * Math.PI) / 180;
    wing.scale.set(0.7, 0.7, 0.7);
    wing.position.set(0, 0.1, modifier * 0.1);        

    return wing;
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
  
  update() {
    if (this.wingsUp) {
      this.wing.rotation.z -= (2 * Math.PI) / 180;
      this.wing2.rotation.z -= (2 * Math.PI) / 180;
      this.wings.position.y += 0.01;
      if (this.wings.position.y >= 0.2) {
        this.wings.position.y = 0.2;
        this.wingsUp = false;
      }
    } else {
      this.wing.rotation.z += (2 * Math.PI) / 180;
      this.wing2.rotation.z += (2 * Math.PI) / 180;
      this.wings.position.y -= 0.01;
      if (this.wings.position.y <= -0.2) {
        this.wings.position.y = -0.2;
        this.wingsUp = true;
      }
    }
  }

}

export { Puffin }
