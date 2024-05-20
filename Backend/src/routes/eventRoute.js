import * as eventController from '../controllers/eventController.js'
import express from 'express'
import {verifyAuthToken} from '../utilities/authentication.js'
import {price, location, title, end_date, start_date, isRequestValid} from '../validator/eventValidation.js'

const router = express.Router()

router.post('/create_event', verifyAuthToken(), price, location, title, end_date, start_date, isRequestValid, eventController.createEvent)
router.delete('/delete_event/:id', verifyAuthToken(), eventController.deleteEvent)
router.get('/all_events', eventController.getAllEvent)
router.put('/update_event/:id', verifyAuthToken(), eventController.updateEvent)
router.get('/event', eventController.getSingleUserEvent)
router.get('/popular_event', eventController.getPopularEvent)
router.post('/join_event', verifyAuthToken(), eventController.joinEvent)
router.post('/un_join_event', verifyAuthToken(), eventController.unJoinEvent)
router.get('/get_all_join_event_detail', verifyAuthToken(), eventController.getJoinEventDetail)
router.post('/get_event_by_id', eventController.getEventById)
router.post('/hide_event', verifyAuthToken(), eventController.hideEvent)

router.get('/search_events', eventController.searchEvents)
router.get('/search_my_events', eventController.searchMyEvents)

export {router}
