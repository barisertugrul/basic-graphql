const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// json-server kullanımı sonrası kapattık
/* var employees = [
    {id: '1', firstName: 'John', lastName: 'Doe', age: 35, email: 'johndoe@google.com' },
    {id: '2', firstName: 'Jane', lastName: 'Doe', age: 30, email: 'janedoe@google.com' },
    {id: '3', firstName: 'Sarah', lastName: 'Brown', age: 23, email: 'sarah@google.com' },
    {id: '4', firstName: 'Andy', lastName: 'Garcia', age: 51, email: 'andy@google.com' },
] */

const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        employee: {
            type: EmployeeType,
            args: {id:{type: GraphQLString}},
            resolve(parent, args){
                // json-server kullanımı sonrası kapattık
                //Veriye erişim
                /* for(let i=0; i<employees.length; i++){
                    if(employees[i].id === args.id){
                        return employees[i];
                    }
                } */
                return axios.get('http://localhost:3000/employees/'+args.id).
                then(res => res.data)
            }
        },
        employees: {
            type: new GraphQLList(EmployeeType),
            resolve(parent, args){
                //return employees;
                return axios.get('http://localhost:3000/employees').
                then(res => res.data)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addEmployee: {
            type: EmployeeType,
            args:{
                firstName: { type: new GraphQLNonNull(GraphQLString)},
                lastName: { type: new GraphQLNonNull(GraphQLString)},
                age: { type: new GraphQLNonNull(GraphQLInt)},
                email: { type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                return axios.post('http://localhost:3000/employees', {
                    firstName: args.firstName,
                    lastName: args.lastName,
                    age: args.age,
                    email: args.email
                }).then(res => res.data)
            }
        },
        deleteEmployee: {
            type: EmployeeType,
            args:{
                id: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return axios.delete('http://localhost:3000/employees/'+ args.id)
                .then(res => res.data)
            }
        },
        updateEmployeeWithPut: {
            type: EmployeeType,
            args:{
                id: { type: new GraphQLNonNull(GraphQLString)},
                firstName: { type: GraphQLString},
                lastName: { type: GraphQLString},
                age: { type: GraphQLInt},
                email: { type: GraphQLString},
            },
            resolve(_, args){
                return axios.put('http://localhost:3000/employees'+ args.id,
                    args).then(res => res.data)
            }
        },
        updateEmployeeWithPatch: {
            type: EmployeeType,
            args:{
                id: { type: new GraphQLNonNull(GraphQLString)},
                firstName: { type: GraphQLString},
                lastName: { type: GraphQLString},
                age: { type: GraphQLInt},
                email: { type: GraphQLString},
            },
            resolve(_, args){
                return axios.patch('http://localhost:3000/employees'+ args.id,
                    args).then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
})