/**
 * a phong shader implementation
 * Created by Samuel Gratzl on 29.02.2016.
 */
attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_modelView;
uniform mat3 u_normalMatrix;
uniform mat4 u_projection;
//given texture coordinates per vertex
attribute vec2 a_texCoord;
// light position as uniform
//second light source
//vec3 lightPos = vec3(0, -2, 2);
uniform vec3 u_lightPos;
uniform vec3 u_light2Pos;
uniform vec3 u_light3Pos;
uniform vec3 u_light4Pos;
uniform vec3 u_light4directionSpotLight;
//output of this shader
varying vec3 v_normalVec;
varying vec3 v_eyeVec;
varying vec3 v_lightVec;
varying vec3 v_light2Vec;
varying vec3 v_light3Vec;
varying vec3 v_light4Vec;
varying vec3 v_light4directionSpotLightVec;
varying vec2 v_texCoord;
void main() {
	vec4 eyePosition = u_modelView * vec4(a_position,1);

  v_normalVec = u_normalMatrix * a_normal;

  v_eyeVec = -eyePosition.xyz;
	// light position as uniform
	v_lightVec = u_lightPos - eyePosition.xyz;
	//second light source position

	v_light2Vec = u_light2Pos - eyePosition.xyz;

	v_light3Vec = u_light3Pos - eyePosition.xyz;

	v_light4Vec = u_light4Pos - eyePosition.xyz;
	v_light4directionSpotLightVec = u_light4directionSpotLight - eyePosition.xyz;
	v_texCoord = a_texCoord;
	gl_Position = u_projection * eyePosition;
}
