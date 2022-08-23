const { default: axios } = require('axios')

const user = {
    token: '',
}

// ----------------------------------------------------------------------
const signIn = async ({ email, password }) => {
    const res = await axios.post('http://localhost:5500/api/user/login', {
        email,
        password,
    })

    const data = res.data

    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)

    if (res.status === 200) {
        user.token = data.accessToken
    }
}

// ----------------------------------------------------------------------

const isFilledTest = async ({ title }) => {
    const res = await axios.post(
        'http://localhost:5500/api/survey/isfilled',
        {
            title,
        },
        {
            headers: {
                authorization: user.token,
            },
        }
    )

    const data = res.data

    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const signUp = async ({ userName, email, password, gender, city, country }) => {
    const res = await axios.post('http://localhost:5500/api/user/register', {
        userName,
        email,
        password,
        gender,
        city,
        country,
    })
    console.log(
        '=============================================================='
    )

    console.log(`Status : ${res.status} \n data : ${res.data}`)
}

// ----------------------------------------------------------------------

const createSurvey = async ({ title, question, choice }) => {
    const res = await axios.post(
        'http://localhost:5500/api/survey/createSurvey',
        {
            title,
            question,
            choice,
        },
        {
            headers: {
                authorization: user.token,
            },
        }
    )
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${res.data}`)
}

// ----------------------------------------------------------------------

const fillSurvey = async ({ title, answer }) => {
    const res = await axios.post(
        'http://localhost:5500/api/survey/fillSurvey',
        {
            title,
            answer,
        },
        {
            headers: {
                authorization: user.token,
            },
        }
    )
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const getSurveys = async ({}) => {
    const res = await axios.get('http://localhost:5500/api/user/mysurveys', {
        headers: {
            authorization: user.token,
        },
    })

    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const getSamples = async ({}) => {
    const res = await axios.get('http://localhost:5500/api/survey/sample', {})

    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}
// ----------------------------------------------------------------------

const getCountries = async () => {
    const res = await axios.get(
        'http://localhost:5500/api/user/countries',

        {}
    )
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const getCities = async ({ country }) => {
    const res = await axios.post(
        'http://localhost:5500/api/user/cities',
        {
            country,
        },

        {}
    )
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const getSurvey = async ({ title }) => {
    const res = await axios.post('http://localhost:5500/api/survey/getSurvey', {
        title,
    })
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const getUserInfo = async ({}) => {
    const res = await axios.get('http://localhost:5500/api/profile/getinfo', {
        headers: {
            authorization: user.token,
        },
    })
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const updateUserInfo = async ({ userName, email, city, country }) => {
    const res = await axios.post(
        'http://localhost:5500/api/profile/update',
        {
            userName,
            email,
            city,
            country,
        },

        {
            headers: {
                authorization: user.token,
            },
        }
    )
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)

    if (res.data.accessToken) {
        user.token = res.data.accessToken
    }
}

// ----------------------------------------------------------------------

const updatePass = async ({ oldPassword, newPassword }) => {
    const res = await axios.put(
        'http://localhost:5500/api/profile/updatepassword',
        {
            oldPassword,
            newPassword,
        },
        {
            headers: {
                authorization: user.token,
            },
        }
    )
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const addComment = async ({ title, comment, parentID }) => {
    const res = await axios.post(
        'http://localhost:5500/api/comment/addcomment',
        {
            title,
            comment,
            parentID,
        },
        {
            headers: {
                authorization: user.token,
            },
        }
    )
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const upVote = async ({ commentID }) => {
    const res = await axios.post(
        'http://localhost:5500/api/comment/upVote',
        {
            commentID,
        },
        {
            headers: {
                authorization: user.token,
            },
        }
    )
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const report = async ({ commentID }) => {
    const res = await axios.post(
        'http://localhost:5500/api/comment/report',
        {
            commentID,
        },
        {
            headers: {
                authorization: user.token,
            },
        }
    )
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const getComments = async ({ title }) => {
    const res = await axios.post(
        'http://localhost:5500/api/comment/comments',
        {
            title,
        },
        {
            headers: {
                authorization: user.token,
            },
        }
    )
    console.log(
        '=============================================================='
    )
    console.log(`Status : ${res.status} \n data : ${JSON.stringify(res.data)}`)
}

// ----------------------------------------------------------------------

const main = async () => {
    await signIn({ email: 'test1@gmail.com', password: 'felat' })

    // await createSurvey({
    //     question: 'En sevilen şehir hangisidir? ',
    //     title: 'En Çok Sevilen Şehirler',
    //     choice: ['Ankara', 'İstanbul', 'İzmir'],
    // })
    // await getSurveys({})
    //await getSamples({})
    //await signUp();
    // await isFilledTest({ title: 'yemek anketi' })
    // await fillSurvey({ title: 'animaldoyoulike', answer: 1 })
    //await getSurvey({ title: 'animaldoyoulike' })
    // await getCountries()
    // await getCities({ country: 'Turkey' })
    // await getUserInfo({})
    // await updateUserInfo({
    //     email: 'test1@gmail.com',
    //     userName: 'felat',
    //     city: 'Ankara',
    //     country: 'Turkey',
    // })
    // await getUserInfo({})

    // await updatePass({ oldPassword: 'Felat123.', newPassword: 'felat' })

    // await addComment({
    //     title: 'bestie',
    //     comment: 'Süper bir anket',
    //     parentID: 7,
    // })

    // await getComments({ title: 'bestie' })

    // await upVote({ commentID: 6 })
    await report({ commentID: 6 })
}
main()
    .then(() => {
        console.log('Finished')
    })
    .catch((err) => console.error(err))
