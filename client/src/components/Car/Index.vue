<template>
	<div class="container createcafe">
		<div class="blog-header">
			<p class="h1">Hypercar/Supercar</p>
			<div>
				<form class="form-inline form-search">
					<div class="form-group">
						<div class="input-group">
							<div class="input-group-addon"><i class="fas fa-search"></i></div>
						</div>
					</div>
				</form>
			</div>
				<div class="create-blog ">
				<button class="btn btn-success btn-sm sizetext" v-on:click="navigateTo('/car/create')"><p class="h5">Create Car</p></button>
				<strong><p class="h6" >Car list:  {{results.length}}</p></strong>
			</div>
		</div>
		<transition-group name="fade">
			<div v-for="car in cars" v-bind:key="car.id" class="blog-list box cafe">
				<!-- <p>id: {{ car.id }}</p> -->
				<div class="blog-pic">
					<!-- <transition name="fade"> -->
					<div class="thumbnail-pic" v-if="car.thumbnail != 'null'">
						<img :src="BASE_URL+car.thumbnail" alt="thumbnail">
					</div>
					<!-- </transition> -->
				</div>
				<h3>{{ car.brand }}</h3>
				<h4>{{ car.gen }}</h4>
				<!-- <div v-html="car.content.slice(0,200) + '...'"></div> -->
				<div class="blog-info">
					<p><strong>Engine:</strong> {{ car.engine }}</p>
					<p><strong>Power:</strong> {{ car.power }}</p>
					<!-- <p>status: {{ car.status }}</p> -->
					<p>
						<button class="btn btn-sm btn-info" v-on:click="navigateTo('/car/'+ car.id)">View
							Car</button>
						<button class="btn btn-sm btn-warning" v-on:click="navigateTo('/car/edit/'+ car.id)">Edit
							car</button>
						<button class="btn btn-sm btn-danger" v-on:click="deleteCar(car)">Delete</button>
					</p>
				</div>
				<div class="clearfix"></div>
			</div>
		</transition-group>
		<div v-if="cars.length === 0 && loading === false" class="empty-blog">
			*** Nodata ***
		</div>
		<div id="car-list-bottom">
			<div class="blog-load-finished" v-if="cars.length === 
			results.length && results.length > 0">.A car is information  complete.</div>
		</div>
	</div>
</template>
<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/src/jquery.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import CarService from '@/services/CarService'
import _ from 'lodash'
import ScrollMonitor from 'scrollMonitor'
import Car from '../../../../server/src/models/Car'
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
			cars: [],
			BASE_URL: "http://localhost:8081/assets/uploads/",
			search: '',
			results: [],
			category: [],
			loading: false,
		}
	},
	async created() {
		this.cars = (await CarService.index()).data
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
		async deleteCar(car) {
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
		async deleteCar(car) {
			let result = confirm("Want to delete?");
			if (result) {
				try {
					await CarService.delete(car);
					this.refreshData();
				} catch (err) {
					console.log(err);
				}
			}
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
}
}
</script>
<style scoped>
.empty-car {
	width: 100%;
	text-align: center;
	padding: 10px;
	background: darksalmon;
	color: white;
}
.h6{
	margin-top: 10px;
	margin-bottom: 5px;
}

/* thumbnail */
.thumbnail-pic img {
	width: 200px;
	padding: 5px 10px 0px 0px;
}
.createcafe{
	margin: 10px;
	margin-top: 10px;
	margin-left: 100px;
}
.car-info {
	float: left;
}

.car-pic {
	float: left;
}

.clearfix {
	clear: both;
}

.car-list {
	border: solid 1px #dfdfdf;
	margin-bottom: 10px;
	margin-left: auto;
	margin-right: auto;
	padding: 5px;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
}

.car-header {
	margin-left: auto;
	margin-right: auto;
}

#car-list-bottom {
	padding-top: 4px;
}

.car-load-finished {
	padding: 4px;
	text-align: center;
	background: seagreen;
	color: white;
}

.categories {
	margin-top: 10px;
	padding: 0;
	list-style: none;
	float: left;
}

.categories li {
	float: left;
	padding: 2px;
}

.categories li a {
	padding: 5px 10px 5px 10px;
	background: paleturquoise;
	color: black;
	text-decoration: none;
}

.categories li.clear a {
	background: tomato;
	color: white
}

.create-car {
	margin-top: 10px;
}
.box{
  padding: 5px;
  border: 2px solid gray;

}
.cafe{
	margin-top: 10px;
}
</style>