define([
    'app', 
	'model/search/SearchTimeframeModel'
], function(
	app,
	SearchTimeframeModel) {

	describe('Search', function() {
		
		describe("SearchTimeframeModel", function() {
			
			beforeEach(function() {
				unit = new SearchTimeframeModel();
			});
	
			it('hasDate() false when not set', function() {
				expect(unit.hasDate('2013-05-01', 'from')).not.toBeTruthy();
		  	});
	
			
			it('hasDate() false when does not match', function() {
				unit.setDate('2013-05-01', 'from');
				expect(unit.hasDate('2013-04-30', 'from')).not.toBeTruthy();
		  	});
	
	
			it('hasDate() true when present', function() {
				unit.setDate('2013-05-01', 'from');
				expect(unit.hasDate('2013-05-01', 'from')).toBeTruthy();
	
				unit.setDate('2013-05-06', 'to');
				expect(unit.hasDate('2013-05-06', 'to')).toBeTruthy();
		  	});
	
	
			it('setDate() overrides to if from is later', function() {
				unit.setDate('2013-05-01', 'to');
				unit.setDate('2013-05-06', 'from');
				expect(unit.hasDate('2013-05-06', 'to')).toBeTruthy();
			});
	
		});
		
	});
});