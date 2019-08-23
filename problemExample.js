var problemModel=require('./models/problem')

const problem={
    name : "Strive1",
    author : "Praguna Manvi",
    company : "strive",
    tag : "adhoc",
    difficulty : "medium",
    date : new Date().toISOString().slice(0,10)
};
const problemDetail={
    description:"print hello world",
    background : "This is the first program",
    attempts : 0,
    solution:"print hello world",
    input: "1/n",
    output : "hello/n",
    success : 0
}
const User={
    username: "striveadmin",
    password : "abcdefgh",
    email : "striveadmin@gmail.com"
}

const Admin={
    email : "striveadmin@gmail.com",
    password : "striveproject123"
}

module.exports={
    problem : problem,
    problemDetail : problemDetail,
    User : User
}