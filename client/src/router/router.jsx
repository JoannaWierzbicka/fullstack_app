
import React from 'react'
import { createBrowserRouter} from 'react-router-dom'
import App from '../App.jsx'
import ReservationList from '../components/ReservationList.jsx'
import ReservationDetail from '../components/ReservationDetail.jsx'
import AddReservation from '../components/AddReservation.jsx'
// import EditReservation from './components/EditReservation.jsx'
import { loadReservations, loadReservation } from '../api/reservations.js'

export const router = createBrowserRouter([
    {
      path: '/',
      element: <App/>,  
      children: [
        {
          index: true,
          element: <ReservationList />,
          loader: loadReservations
        },
        {
          path: 'detail/:id',
          element: <ReservationDetail />,
          loader: ({ params }) => loadReservation(params.id)
        },
        {
          path: 'add',
          element: <AddReservation />
        },
        {
          path: 'edit/:id',
          element: <ReservationDetail />,
          loader: ({ params }) => loadReservation(params.id)
        }
      ]
    }
  ])

  export default router