({
	baseUrl: 'app/',
	name: 'config',
	out: 'app/optimized.js',
	mainConfigFile: 'app/config.js',
	include: ['requireLib'],
	paths: {
		requireLib: '../lib/require/require',
		google: 'empty:'
	}
})