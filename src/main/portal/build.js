({
	baseUrl: 'app/',
	name: 'config',
	out: 'optimized.js',
	mainConfigFile: 'app/config.js',
	include: ['requireLib'],
	paths: {
		requireLib: '../lib/require/require',
		google: 'empty:'
	}
})