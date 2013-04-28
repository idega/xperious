define([
	'model/search/SearchTimeframeModel'
], function(SearchTimeframeModel) {

	describe("SearchTimeframeModel", function() {

		it("adds from date first", function() {
			var unit = new SearchTimeframeModel();
			unit.addDate('2011-02-02');
			expect(unit.get('from').format('YYYY-MM-DD')).toBe('2011-02-02');
	  	});

	});

});