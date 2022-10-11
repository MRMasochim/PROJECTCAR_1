<template>
	<div class="container createcafe box">
		<div class="blog-header">
			<!-- <p>id: {{ car.id }}</p> -->
			<div class="blog-pic">
				<p class="h1 center">{{car.brand}}</p>
				<p class="h2 center">{{car.gen}}</p>
			</div>
		<div v-html="car.content.slice()"></div>
		<div class="car-info">
			<p><strong>engine:</strong> {{ car.engine }}</p>
			<p><strong>power:</strong> {{ car.power }} </p>
			<button v-on:click="navigateTo('/car/edit/' + car.id)" class="btn btn-success">
				Edit car
			</button>
			<button v-on:click="navigateTo('/cars')" class="btn btn-warning">Back</button>
		</div>
		</div>
	</div>
</template>
<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/src/jquery.js'
import _ from 'lodash'
import 'bootstrap/dist/js/bootstrap.min.js'
import CarService from "@/services/CarService";
let LOAD_NUM = 3
let pageWatcher
export default {
	watch: {
		search: _.debounce(async function (value) {
			const route = {
				name: 'cars'
			}
			if (this.search !== '') {
				route.query = {
					search: this.search
				}
			}
			console.log('search: ' + this.search)
			this.$router.push(route)
		}, 700),
		'$route.query.search': {
			immediate: true,
			async handler(value) {
				this.cars = []
				this.results = []
				this.loading = true
				this.results = (await CarService.index(value)).data
				this.appendResults()
				this.results.forEach(car => {
					if (this.category.length > 0) {
						console.log(this.category.indexOf(car.category))
						if (this.category.indexOf(car.category) === -1) {
							this.category.push(car.category)
						}
					} else {

						this.category.push(car.category)
					}
				})
				this.loading = false
				this.search = value
				console.log(this.category)
			}
		}
	},
	data() {
		return {
			car: null,
		};
	},
	async created() {
		try {
			let carId = this.$route.params.carId;
			this.car = (await CarService.show(carId)).data;
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		wait(ms) {
			return x => {
				return new Promise(resolve => setTimeout(() => resolve(x), ms));
			};
		},
		appendResults: function () {
			if (this.cars.length < this.results.length) {
				let toAppend = this.results.slice(
					this.cars.length,
					LOAD_NUM + this.cars.length
				)
				this.cars = this.cars.concat(toAppend)
			}
		},
		navigateTo(route) {
			this.$router.push(route)
		},
		async deletecar(car) {
			try {
				await CarService.delete(car)
				this.refreshData()
			} catch (err) {
				console.log(err)
			}
		},
		async refreshData() {
			this.cars = (await CarService.index()).data
		},
		setCategory(keyword) {
			if (keyword === ' ') {
				this.search = ''
				console.log('null')
			} else {
				this.search = keyword
			}
		},
	},
	updated() {
		let sens = document.querySelector('#car-list-bottom')
		pageWatcher = ScrollMonitor.create(sens)
		pageWatcher.enterViewport(this.appendResults)
	},
	beforeUpdated() {
		if (pageWatcher) {
			pageWatcher.destroy()
			pageWatcher = null
		}
	}
};
</script>
<style scoped>
.createcafe{
	margin: 10px;
	margin-top: 10px;
	margin-left: 100px;
}
.center{
	text-align: center;
	}
.box{
  padding: 10px;
  border: 5px solid gray;

}
</style>
