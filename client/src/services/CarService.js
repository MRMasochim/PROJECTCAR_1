import Api from '@/services/Api'

export default {
    index() {
        return Api().get('cars')
    },
    show(carId){
        return Api().get('car/'+carId)
    },
    post(car){
        return Api().post('car', car)
    },
    put(car){
        return Api().put('car/'+car.id, car)
    },
    delete(car){
        return Api().delete('car/'+car.id, car)
    },
}