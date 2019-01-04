"use strict"

// SHADER 3D MINIMUM

var white_vert=`#version 300 es
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
in vec3 position_in;
in vec2 texcoord_in;

out vec2 TC0;

void main()
{
	TC0 = texcoord_in;
	gl_Position = projectionMatrix * viewMatrix * vec4(position_in,1);
}`;

var white_frag=`#version 300 es
precision highp float;
out vec4 frag_out;

uniform sampler2D TU0;
uniform sampler2D TU1;
uniform int hasSky;

in vec2 TC0;
void main()
{
	if(hasSky == 1) {
		vec4 sol = texture(TU0, TC0).rgba;
		vec4 ciel = texture(TU1, TC0).rgba;
		frag_out = vec4(mix(sol, ciel, ciel.r));
	}
	else {
		vec4 sol = texture(TU0, TC0).rgba;
		frag_out = sol;
	}
}`;

var circle_vert=`#version 300 es
uniform mat4 projectionMatrix;
uniform int nb;

void main()
{
	gl_PointSize = 2.0;
	float a = 6.2832*float(gl_VertexID)/float(nb);
	gl_Position = projectionMatrix * vec4(sin(a),cos(a),0,1);
}
`;

var color_frag=`#version 300 es
precision mediump float;
out vec4 frag_out;
void main()
{
	frag_out = vec4(1,1,1,1);
}
`;

let mesh_rend_s = null;
let mesh_rend_m = null;
let mesh_rend_v = null;
let mesh_rend_t = null;
let mesh_rend_l = null;
let mesh_rend_ma = null;
let mesh_rend_j = null;
let mesh_rend_sa = null;
let mesh_rend_u = null;
let mesh_rend_n = null;

let text_s = null;
let text_m = null;
let text_v = null;
let text_t = null;
let text_sk = null;
let text_l = null;
let text_ma = null;
let text_j = null;
let text_sa = null;
let text_u = null;
let text_n = null;

// let uranus = Mesh.Sphere(20);

let distance_soleil = 10000000;
var prg_circ = null;

let prg_white = null;
var vao1 = null;

var sl_n;

function create_interf() {
	UserInterface.begin(); // name of html id
	sl_n = UserInterface.add_slider('Temps', 1, 100, 0, update_wgl);

	UserInterface.use_field_set('V',"Distances");
  UserInterface.add_label("+ : augmentation");
  UserInterface.add_label("- :  diminution");
	UserInterface.add_label("espace : état initial");
	UserInterface.add_br();
}

function onkey_wgl(k) {
    switch (k) {
        case '+':
					if(distance_soleil >  5000000) {
						distance_soleil -= 100000;
					}
          break;

        case '-':
        	if(distance_soleil <  20000000) {
						distance_soleil += 100000;
					}
          break;

        case ' ':
          distance_soleil = 10000000;
        	break;

        default:
					return false;
          break;
    }
		return true;
}

function init_wgl() {
	create_interf();

	prg_circ = ShaderProgram(circle_vert,color_frag,'Circle');
	prg_white = ShaderProgram(white_vert,white_frag,'white');

  //crée un tore
	let soleil = Mesh.Sphere(20);
	let mercure = Mesh.Sphere(20);
	let venus = Mesh.Sphere(20);
	let terre = Mesh.Sphere(20);
	let lune = Mesh.Sphere(20);
	let mars = Mesh.Sphere(20);
	let jupiter = Mesh.Sphere(20);
	let saturne = Mesh.Sphere(20);
	let uranus = Mesh.Sphere(20);
	let neptune = Mesh.Sphere(20);

	//crée le renderer (positions?/normales?/coord_texture?)
  //il contient VBO + VAO + VBO + draw()
  mesh_rend_s = soleil.renderer(true,true,true);
	mesh_rend_m = mercure.renderer(true,true,true);
	mesh_rend_v = venus.renderer(true,true,true);
	mesh_rend_t = terre.renderer(true,true,true);
	mesh_rend_l = lune.renderer(true,true,true);
	mesh_rend_ma = mars.renderer(true,true,true);
	mesh_rend_j = jupiter.renderer(true,true,true);
	mesh_rend_sa = saturne.renderer(true,true,true);
	mesh_rend_u = uranus.renderer(true,true,true);
	mesh_rend_n = neptune.renderer(true,true,true);

	text_s = Texture2d();
	text_s.load('textures/sun.jpg');

	text_m = Texture2d();
	text_m.load('textures/mercury.jpg');

	text_v = Texture2d();
	text_v.load('textures/venus_surface.jpg');

	text_t = Texture2d();
	text_t.load('textures/earth_daymap.jpg');

	text_sk = Texture2d();
	text_sk.load('textures/earth_clouds.jpg');

	text_l = Texture2d();
	text_l.load('textures/moon.jpg');

	text_ma = Texture2d();
	text_ma.load('textures/mars.jpg');

	text_j = Texture2d();
	text_j.load('textures/jupiter.jpg');

	text_sa = Texture2d();
	text_sa.load('textures/saturn.jpg');

	text_u = Texture2d();
	text_u.load('textures/uranus.jpg');

	text_n = Texture2d();
	text_n.load('textures/neptune.jpg');

	ewgl_continuous_update = true;
  let now = new Date(Date.now());
  ewgl_current_time = now.getHours()*3600+now.getMinutes()*60;

  //place la caméra pour bien voir l'objet
	// scene_camera.show_scene(terre.BB.center);
	scene_camera.set_scene_radius(500);
	scene_camera.set_scene_center(terre.BB.center);
}

function draw_wgl() {
	gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//les matrices sont déduites de la caméra
	const projection_matrix = scene_camera.get_projection_matrix();
	const view_matrix = scene_camera.get_view_matrix();

	let taille_soleil = 1390000;

	prg_circ.bind();
	let distance_mercure = (59000000/distance_soleil)+15;
	let distance_venus = (108000000/distance_soleil)+15;
	let distance_terre = (150000000/distance_soleil)+15;
	let distance_mars = (229000000/distance_soleil)+15;
	let distance_jupiter = (780000000/distance_soleil)+15;
	let distance_saturne = (1430000000/distance_soleil)+15;
	let distance_uranus = (2872000000/distance_soleil)+15;
	let distance_neptune = (4497000000/distance_soleil)+15;

	/*mercure*/
	update_uniform('projectionMatrix', mmult(projection_matrix, view_matrix, scale(distance_mercure)));
	update_uniform('nb', 50);
	gl.drawArrays(gl.LINE_LOOP, 0, 50);

	/*vénus*/
	update_uniform('projectionMatrix', mmult(projection_matrix, view_matrix, scale(distance_venus)));
	update_uniform('nb', 50);
	gl.drawArrays(gl.LINE_LOOP, 0, 50);

	/*terre*/
	update_uniform('projectionMatrix', mmult(projection_matrix, view_matrix, scale(distance_terre)));
	update_uniform('nb', 50);
	gl.drawArrays(gl.LINE_LOOP, 0, 50);

	/*mars*/
	update_uniform('projectionMatrix', mmult(projection_matrix, view_matrix, scale(distance_mars)));
	update_uniform('nb', 50);
	gl.drawArrays(gl.LINE_LOOP, 0, 50);

	/*jupiter*/
	update_uniform('projectionMatrix', mmult(projection_matrix, view_matrix, scale(distance_jupiter)));
	update_uniform('nb', 50);
	gl.drawArrays(gl.LINE_LOOP, 0, 50);

	/*saturne*/
	update_uniform('projectionMatrix', mmult(projection_matrix, view_matrix, scale(distance_saturne)));
	update_uniform('nb', 50);
	gl.drawArrays(gl.LINE_LOOP, 0, 50);

	/*uranus*/
	update_uniform('projectionMatrix', mmult(projection_matrix, view_matrix, scale(distance_uranus)));
	update_uniform('nb', 50);
	gl.drawArrays(gl.LINE_LOOP, 0, 50);

	/*neptune*/
	update_uniform('projectionMatrix', mmult(projection_matrix, view_matrix, scale(distance_neptune)));
	update_uniform('nb', 50);
	gl.drawArrays(gl.LINE_LOOP, 0, 50);

	prg_white.bind();

	/*soleil*/
	let rotation_soleil = 25/1000;

	let pos = mmult(
									view_matrix,
							    translate(0, 0, 0),
									rotateZ((ewgl_current_time*sl_n.value)/rotation_soleil),
									scale(15, 15, 15)
								);
	update_uniform('viewMatrix', pos);
	update_uniform('projectionMatrix', projection_matrix);
	text_s.bind(0);
	mesh_rend_s.draw(gl.TRIANGLES);

	/*mercure*/
	let scale_mercure = (4879/taille_soleil)*100;
	let revolution_mercure = 88/1000;
	let rotation_mercure = 59/1000;

	let pos2 = mmult(// console.log(uranus);
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/revolution_mercure),
									 translate(distance_mercure, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/rotation_mercure),
									 scale(scale_mercure, scale_mercure, scale_mercure)
								 );
	update_uniform('viewMatrix', pos2);
	update_uniform('projectionMatrix', projection_matrix);
	text_m.bind(0);
	mesh_rend_m.draw(gl.TRIANGLES);

	/*vénus*/
	let scale_venus = (12104/taille_soleil)*100;
	let revolution_venus = 225/1000;
	let rotation_venus = 243/1000;

	let pos3 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/revolution_venus),
									 translate(distance_venus, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/rotation_venus),
									 scale(scale_venus, scale_venus, scale_venus)
								 );
	update_uniform('viewMatrix', pos3);
	update_uniform('projectionMatrix', projection_matrix);
	text_v.bind(0);
	mesh_rend_v.draw(gl.TRIANGLES);

	/*terre*/
	let scale_terre = (12756/taille_soleil)*100;
	let revolution_terre = 365/1000;
	let rotation_terre = 1/10;

	let pos4 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/revolution_terre),
									 translate(distance_terre, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/rotation_terre),
									 scale(scale_terre, scale_terre, scale_terre)
								 );
	update_uniform('viewMatrix', pos4);
	update_uniform('projectionMatrix', projection_matrix);
	text_t.bind(0);
	text_sk.bind(1);
	update_uniform('hasSky', 1);
	mesh_rend_t.draw(gl.TRIANGLES);
	update_uniform('hasSky', 0);

	/*mars*/
	let scale_mars = (6792/taille_soleil)*100;
	let revolution_mars = 720/1000;
	let rotation_mars = 1/10;

	let pos5 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/revolution_mars),
									 translate(distance_mars, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/rotation_mars),
									 scale(scale_mars, scale_mars, scale_mars)
								 );
	update_uniform('viewMatrix', pos5);
	update_uniform('projectionMatrix', projection_matrix);
	text_ma.bind(0);
	mesh_rend_t.draw(gl.TRIANGLES);

	/*jupiter*/
	let scale_jupiter = (142984/taille_soleil)*100;
	let revolution_jupiter = 4380/10000;
	let rotation_jupiter = (10/24)/10;

	let pos6 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/revolution_jupiter),
									 translate(distance_jupiter, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/rotation_jupiter),
									 scale(scale_jupiter, scale_jupiter, scale_jupiter)
								 );
	update_uniform('viewMatrix', pos6);
	update_uniform('projectionMatrix', projection_matrix);
	text_j.bind(0);
	mesh_rend_j.draw(gl.TRIANGLES);

	/*saturne*/
	let scale_saturne = (120536/taille_soleil)*100;
	let revolution_saturne = 10585/10000;
	let rotation_saturne = (11/24)/10;

	let pos7 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/revolution_saturne),
									 translate(distance_saturne, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/rotation_saturne),
									 scale(scale_saturne, scale_saturne, scale_saturne)
								 );
	update_uniform('viewMatrix', pos7);
	update_uniform('projectionMatrix', projection_matrix);
	text_sa.bind(0);
	mesh_rend_sa.draw(gl.TRIANGLES);

	/*uranus*/
	let scale_uranus = (51118/taille_soleil)*100;
	let revolution_uranus = 30660/10000;
	let rotation_uranus = (17/24)/10;

	let pos8 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/revolution_uranus),
									 translate(distance_uranus, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/rotation_uranus),
									 scale(scale_uranus, scale_uranus, scale_uranus)
								 );
	update_uniform('viewMatrix', pos8);
	update_uniform('projectionMatrix', projection_matrix);
	text_u.bind(0);
	mesh_rend_u.draw(gl.TRIANGLES);

	/*neptune*/
	let scale_neptune = (49528/taille_soleil)*100;
	let revolution_neptune = 60225/10000;
	let rotation_neptune = (16/24)/10;

	let pos9 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/revolution_neptune),
									 translate(distance_neptune, 0, 0),
									 rotateZ((ewgl_current_time*sl_n.value)/rotation_neptune),
									 scale(scale_neptune, scale_neptune, scale_neptune)
								 );
	update_uniform('viewMatrix', pos9);
	update_uniform('projectionMatrix', projection_matrix);
	text_n.bind(0);
	mesh_rend_n.draw(gl.TRIANGLES);
	unbind_shader();
}

launch_3d();
