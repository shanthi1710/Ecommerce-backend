import {PrismaClient} from '@prisma/client'

export const prismaClient = new PrismaClient({
    log:['query']
}).$extends({
    result:{
        address:{
            formattedAddress:{
                needs:{
                    lineOne:true,
                    lineTwo:true,
                    city:true,
                    state:true,
                    country:true,
                    pincode:true
                },
                compute:(addr)=>{
                    return `${addr.lineOne},${addr.lineTwo},${addr.city},${addr.state},${addr.country}-${addr.pincode}`
                }
            }
        }
    }
})