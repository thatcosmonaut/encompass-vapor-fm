uniform sampler2D textureSampler;
uniform float time;
uniform vec3 lightColor;
varying vec2 vUV;

void main() {
    vec2 pos = vUV - vec2(0.5,0.5);
    float horizon = 0.0;
    float fov = 0.3;
	float scaling = 0.1;

	vec3 p = vec3(pos.x, fov, pos.y - horizon);
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;

	//checkboard texture
	float black_or_white = sign((mod(s.x, 0.2) - 0.1) * (mod(abs(s.y)+time*0.08, 0.2) - 0.1));
 	//fading
	black_or_white *= p.z*p.z*10.0;

    vec3 color = lightColor * black_or_white;

	gl_FragColor = vec4(color, 1.0);
}
