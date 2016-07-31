Vue.use(VueResource);

new Vue({
	el: '#postagens',
	ready: function(){
		this.$http.get('/postagens').then(function(response){
			this.$set('postagens', response.data);
		});
	}
	/*data:{
		postagens: [
		{
			texto: 'Mais ou menos...'
		}, {
			texto: 'Tô na bad!'
		},{
			texto: 'Bad day!'
		}
		]		
	}*/
});