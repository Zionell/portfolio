import {IToursApi} from "~/assets/interfaces/apiInterface";

export const toursApi: IToursApi = {
    tours: {
        list: (pageSize = 4, pageNumber = 1) =>  `/api/tours/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        detail: (id) => `/api/tours/${id}/`,
        facets: '/api/tours/facets/',
        specs: '/api/tours/specs/',
    }
}
