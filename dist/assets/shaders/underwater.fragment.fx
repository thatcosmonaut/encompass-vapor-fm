uniform sampler2D textureSampler;
varying vec2 vUV;
uniform float time;

float PI = 2.0 * asin(1.0);
bool infinite = true;

struct WaveEmitter {
	vec2 mPosition; // = vec2(0.5, 0.5);
	float mAmplitude; // = 0.01;	// factor of final displacement
	float mVelocity; // = 0.05;		// screens per second
	float mWavelength; // = 0.3;	// screens
};

float GetPeriodTime(WaveEmitter emitter) {
    return emitter.mWavelength / emitter.mVelocity;
}

int emitter_size = 1;
WaveEmitter emitter[3];

float GetPhase(vec2 point, WaveEmitter emit, float time) {
	float distance = sqrt( pow(point.x - emit.mPosition.x,2.0) + pow(point.y - emit.mPosition.y, 2.0) );
	if (!infinite && distance / emit.mVelocity >= time) {
		return 0.0;
	} else {
		return sin((time / GetPeriodTime(emit) - distance / emit.mWavelength) * 2.0 * PI);
	}
}

vec2 transformCoord(vec2 orig) {
	vec2 final = orig;
	for(int i = 0; i < emitter_size; ++i) {
		vec2 rel = orig - emitter[i].mPosition;
		float fac = GetPhase(orig, emitter[i], time) * emitter[i].mAmplitude;
		final += fac * rel;
	}
	return final;
}

vec4 transformColor(vec4 c, vec2 p) {
	float fac = 0.0;
	float a = 0.0;
	for(int i = 0; i < emitter_size; ++i) {
		fac += GetPhase(p, emitter[i], time) * emitter[i].mAmplitude;
		a = emitter[i].mAmplitude;
	}
	fac = (fac / a + 1.0)/2.0;
	return c * fac;
}

void main()
{
	WaveEmitter emit0;
	emit0.mPosition = vec2(0.2,0.2);
	emit0.mAmplitude = 0.202;
	emit0.mVelocity = 0.06;
	emit0.mWavelength = 0.3;
	emitter[0] = emit0;

	WaveEmitter emit1;
	emit1.mPosition = vec2(0.6,0.6);
	emit1.mAmplitude = 0.02;
	emit1.mVelocity = 0.07;
	emit1.mWavelength = 0.3;
	emitter[1] = emit1;

	WaveEmitter emit2;
	emit2.mPosition = vec2(0.3,0.4);
	emit2.mAmplitude = 0.205;
	emit2.mVelocity = 0.05;
	emit2.mWavelength = 0.8;
	emitter[2] = emit2;

	vec2 coord = transformCoord(vUV);
	//vec2 coord = gl_TexCoord[0].st;
	//gl_FragColor = transformColor(texture2D(tex, coord), coord);
	//fragColor = texture(iChannel0, coord);

    //fragColor = texture(iChannel0, fragCoord);
    gl_FragColor = texture2D(textureSampler, coord);
    //gl_FragColor = texture2D(textureSampler, vUV);
    //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
