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

in vec2 TC0;
void main()
{
	vec4 color = texture(TU0, TC0).rgba;
	frag_out = color;
  // frag_out = vec4(1,1,1,1);
}`;

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
let text_l = null;
let text_ma = null;
let text_j = null;
let text_sa = null;
let text_u = null;
let text_n = null;

let prg_white = null;
var vao1 = null;
function init_wgl()
{
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
	scene_camera.show_scene(soleil.BB);
	scene_camera.set_scene_radius(500);
}

function draw_wgl()
{
	gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//les matrices sont déduites de la caméra
	const projection_matrix = scene_camera.get_projection_matrix();
	const view_matrix = scene_camera.get_view_matrix();

	prg_white.bind();

	let taille_soleil = 1390000;
	let distance_soleil = 10000000;

	/*soleil*/
	let rotation_soleil = 25/1000;

	let pos = mmult(
									view_matrix,
							    translate(0, 0, 0),
									rotateZ(ewgl_current_time/rotation_soleil),
									scale(15, 15, 15)
								);
	update_uniform('viewMatrix', pos);
	update_uniform('projectionMatrix', projection_matrix);
	text_s.bind(0);
	mesh_rend_s.draw(gl.TRIANGLES);

	/*mercure*/
	let scale_mercure = (4879/taille_soleil)*100;
	let distance_mercure = (59000000/distance_soleil)+15;
	let revolution_mercure = 88/1000;
	let rotation_mercure = 59/1000;

	let pos2 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ(ewgl_current_time/revolution_mercure),
									 translate(distance_mercure, 0, 0),
									 rotateZ(ewgl_current_time/rotation_mercure),
									 scale(scale_mercure, scale_mercure, scale_mercure)
								 );
	update_uniform('viewMatrix', pos2);
	update_uniform('projectionMatrix', projection_matrix);
	text_m.bind(0);
	mesh_rend_m.draw(gl.TRIANGLES);

	/*vénus*/
	let scale_venus = (12104/taille_soleil)*100;
	let distance_venus = (108000000/distance_soleil)+15;
	let revolution_venus = 225/1000;
	let rotation_venus = 243/1000;

	let pos3 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ(ewgl_current_time/revolution_venus),
									 translate(distance_venus, 0, 0),
									 rotateZ(ewgl_current_time/rotation_venus),
									 scale(scale_venus, scale_venus, scale_venus)
								 );
	update_uniform('viewMatrix', pos3);
	update_uniform('projectionMatrix', projection_matrix);
	text_v.bind(0);
	mesh_rend_v.draw(gl.TRIANGLES);

	/*terre*/
	let scale_terre = (12756/taille_soleil)*100;
	let distance_terre = (150000000/distance_soleil)+15;
	let revolution_terre = 365/1000;
	let rotation_terre = 1/10;

	let pos4 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ(ewgl_current_time/revolution_terre),
									 translate(distance_terre, 0, 0),
									 rotateZ(ewgl_current_time/rotation_terre),
									 scale(scale_terre, scale_terre, scale_terre)
								 );
	update_uniform('viewMatrix', pos4);
	update_uniform('projectionMatrix', projection_matrix);
	text_t.bind(0);
	mesh_rend_t.draw(gl.TRIANGLES);

	/*mars*/
	let scale_mars = (6792/taille_soleil)*100;
	let distance_mars = (229000000/distance_soleil)+15;
	let revolution_mars = 720/1000;
	let rotation_mars = 1/10;

	let pos5 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ(ewgl_current_time/revolution_mars),
									 translate(distance_mars, 0, 0),
									 rotateZ(ewgl_current_time/rotation_mars),
									 scale(scale_mars, scale_mars, scale_mars)
								 );
	update_uniform('viewMatrix', pos5);
	update_uniform('projectionMatrix', projection_matrix);
	text_ma.bind(0);
	mesh_rend_t.draw(gl.TRIANGLES);

	/*jupiter*/
	let scale_jupiter = (142984/taille_soleil)*100;
	let distance_jupiter = (780000000/distance_soleil)+15;
	let revolution_jupiter = 4380/10000;
	let rotation_jupiter = (10/24)/10;

	let pos6 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ(ewgl_current_time/revolution_jupiter),
									 translate(distance_jupiter, 0, 0),
									 rotateZ(ewgl_current_time/rotation_jupiter),
									 scale(scale_jupiter, scale_jupiter, scale_jupiter)
								 );
	update_uniform('viewMatrix', pos6);
	update_uniform('projectionMatrix', projection_matrix);
	text_j.bind(0);
	mesh_rend_j.draw(gl.TRIANGLES);

	/*saturne*/
	let scale_saturne = (120536/taille_soleil)*100;
	let distance_saturne = (1430000000/distance_soleil)+15;
	let revolution_saturne = 10585/10000;
	let rotation_saturne = (11/24)/10;

	let pos7 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ(ewgl_current_time/revolution_saturne),
									 translate(distance_saturne, 0, 0),
									 rotateZ(ewgl_current_time/rotation_saturne),
									 scale(scale_saturne, scale_saturne, scale_saturne)
								 );
	update_uniform('viewMatrix', pos7);
	update_uniform('projectionMatrix', projection_matrix);
	text_sa.bind(0);
	mesh_rend_sa.draw(gl.TRIANGLES);

	/*uranus*/
	let scale_uranus = (51118/taille_soleil)*100;
	let distance_uranus = (2872000000/distance_soleil)+15;
	let revolution_uranus = 30660/10000;
	let rotation_uranus = (17/24)/10;

	let pos8 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ(ewgl_current_time/revolution_uranus),
									 translate(distance_uranus, 0, 0),
									 rotateZ(ewgl_current_time/rotation_uranus),
									 scale(scale_uranus, scale_uranus, scale_uranus)
								 );
	update_uniform('viewMatrix', pos8);
	update_uniform('projectionMatrix', projection_matrix);
	text_u.bind(0);
	mesh_rend_u.draw(gl.TRIANGLES);

	/*neptune*/
	let scale_neptune = (49528/taille_soleil)*100;
	let distance_neptune = (4497000000/distance_soleil)+15;
	let revolution_neptune = 60225/10000;
	let rotation_neptune = (16/24)/10;

	let pos9 = mmult(
									 view_matrix,
									 translate(0, 0, 0),
									 rotateZ(ewgl_current_time/revolution_neptune),
									 translate(distance_neptune, 0, 0),
									 rotateZ(ewgl_current_time/rotation_neptune),
									 scale(scale_neptune, scale_neptune, scale_neptune)
								 );
	update_uniform('viewMatrix', pos9);
	update_uniform('projectionMatrix', projection_matrix);
	text_n.bind(0);
	mesh_rend_n.draw(gl.TRIANGLES);
	unbind_shader();
}

launch_3d();
