define([
    'app',
	'model/plan/PlanModel',
	'model/plan/PlanCollection',
], function(
	app,
	PlanModel, 
	PlanCollection) {
	
	describe('Plan', function() {

		beforeEach(function() {
			app.search.pref.set({
				'country' : 'is',
				'from' : moment('2013-03-01'),
				'to' : moment('2013-04-01'),
				'guests' : 2,
				'budget' : {
					'from': 0,
					'to' : 1000
				},
				'arrival' : {
					time: 0,
					terminal: 'reykjavik'
				}
			}, {silent: true});

		});
		

		describe('PlanCollection', function() {

			beforeEach(function() {
				server = sinon.fakeServer.create();
				server.respondWith(responses.search.success);
				plans = new PlanCollection();
				plans.fetch();
				server.respond();
			});


			afterEach(function() {
				server.restore();
			});


			it('fetch from server has correct size', function() {
				expect(plans.size()).toBe(5);
			});

			
			describe('PlanModel', function() {
				
				it('items are grouped by days', function() {
					var days = plans.at(0).days();
					expect(days.length).toBe(7);
					for (var i = 0; i < days.length; i++) {
						var current = moment(days[i][0].get('on')).startOf('day');
						var expected = moment('2013-04-29').add(i, 'days');
						expect(current.diff(expected)).toBe(0);
					}
				});

			});

		});
	});
		
});