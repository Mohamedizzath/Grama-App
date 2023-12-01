const addressRequests = [
    {
        "requestId": 10001,
        "address": "no.430, Kollupitiya, Colombo 3",
        "nic": "200102612345",
        "grama-division": "Kollupitiya",
        "applied-date": "2023-11-27",
        "status": "PENDING",
        "approved-by": null
    },
    {
        "requestId": 10002,
        "address": "no.542, Bambalapitiya, Colombo 3",
        "nic": "200007612855",
        "grama-division": "Bambalapitiya",
        "applied-date": "2023-11-10",
        "status": "VERIFIED",
        "approved-by": {
            "id": 10010,
            "name": "P. Chanaka Fernando",
            "approved-date": "2023-11-20"
        }
    },
    {
        "requestId": 10003,
        "address": "no.722, Kollupitiya, Colombo 3",
        "nic": "200104320112",
        "grama-division": "Kollupitiya",
        "applied-date": "2023-10-12",
        "status": "REJECTED",
        "approved-by": {
            "id": 10009,
            "name": "T. Kasun Hewage",
            "approved-date": "2023-10-20"
        }
    },
    { 
        "requestId": 10004,
        "nic": "200010022004",
        "address": "no.430, Bambalapitiya, Colombo 3",
        "grama-division": "Bambalapitiya",
        "applied-date": "2023-11-07",
        "status": "PENDING",
        "approved-by": null
    },
];

export default addressRequests;