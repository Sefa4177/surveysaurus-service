const { executeCypherQuery } = require('../helper/db/dbHelper')

module.exports = {
    addComment: async ({ email, title, comment, parentID }) => {
        try {
            let writeQuery
            if (parentID == undefined) {
                writeQuery = `MATCH(u:User) WHERE u.email = "${email}"
            MATCH (s:Survey) WHERE s.title = "${title}"
            MATCH (p:CommentCounter)
            CREATE (c:Comment{commentID:p.count+1, comment:"${comment}",time: datetime.realtime('+03:00'),upvote:0,report:0, path : [p.count+1]}) 
            SET p.count = p.count+1
            CREATE (c)-[r:TO]->(s)
            CREATE (u)-[t:WRITED]->(c)
            RETURN c.commentID as result`
            } else {
                writeQuery = `MATCH(u:User) WHERE u.email = "${email}"
                MATCH (s:Survey) WHERE s.title = "${title}"
                MATCH (c1: Comment) WHERE c1.commentID = ${parentID}
                MATCH (p:CommentCounter)
                CREATE (c:Comment{commentID:p.count+1, comment:"${comment}",time: datetime.realtime('+03:00'),upvote:0,report:0,  
                path : c1.path + (p.count+1)}) 
                SET p.count = p.count+1
                CREATE (c)-[r:TO]->(c1)
                CREATE (u)-[t:WRITED]->(c)
                RETURN c.commentID as result`
            }

            const writeResult = await executeCypherQuery(writeQuery)

            const [commentID] = writeResult.records.map((_rec) => _rec.get('result'))

            return {
                status: true,
                data: { commentID },
                message: 'Added Comment Successfully',
            }
        } catch (error) {
            ////////////////////////////////////////////
            return {
                status: false,
                data: {},
                message: `Something went wrong: ${error.message}`,
            }
        }
    },

    upVote: async ({ email, commentID }) => {
        try {
            const Query1 = `MATCH (n:User) WHERE n.email = "${email}"
            MATCH (m:Comment) WHERE m.commentID = ${commentID}
            MATCH (n)-[r:UPVOTED]->(m)
            RETURN COUNT(r) AS c`
            const Result1 = await executeCypherQuery(Query1)
            const res1 = Result1.records.map((_rec) => _rec.get('c'))
            if (res1 == 0) {
                const writeQuery = `MATCH (n:User) WHERE n.email = "${email}"
                                    MATCH (m:Comment) WHERE m.commentID = ${commentID}
                                    CREATE (n)-[r:UPVOTED]->(m)
                                    SET m.upvote = m.upvote+1 RETURN r`
                const writeResult = await executeCypherQuery(writeQuery)
                writeResult.records.map((_rec) => _rec.get('r'))
                return {
                    status: true,
                    data: { commentID },
                    message: 'Comment upvoted successfully',
                }
            } else {
                const writeQuery = `MATCH (n:User) WHERE n.email = "${email}"
                MATCH (m:Comment) WHERE m.commentID = ${commentID}
                MATCH (n)-[r:UPVOTED]->(m)
                WITH r,m
                SET m.upvote = m.upvote-1
                DELETE r`
                const writeResult = await executeCypherQuery(writeQuery)
                return {
                    status: true,
                    data: { commentID },
                    message: 'Upvote deleted successfully',
                }
            }
        } catch (error) {
            return {
                status: false,
                data: {},
                message: `Something went wrong: ${error.message}`,
            }
        }
    },

    report: async ({ email, commentID }) => {
        try {
            let isReportedCheckQuery = `MATCH (u:User)-[r:REPORTED]->(c:Comment) WHERE u.email = "${email}" AND c.commentID = ${commentID} RETURN r`
            let isWritedCheckQuery = `MATCH (u:User)-[w:WRITED]->(c:Comment) WHERE u.email = "${email}" AND c.commentID = ${commentID} RETURN w`
            let reportCountQuery = `MATCH (c:Comment) WHERE c.commentID = ${commentID}  RETURN c.report AS c`

            const isReportedCheckQueryRES = await executeCypherQuery(isReportedCheckQuery)
            const isWritedCheckQueryRES = await executeCypherQuery(isWritedCheckQuery)
            const reportCountQueryRES = await executeCypherQuery(reportCountQuery)

            const isReported = isReportedCheckQueryRES.records.length == 0
            const isWrited = isWritedCheckQueryRES.records.length == 0

            const reportCount = reportCountQueryRES.records.map((_rec) => _rec.get('c'))

            if (isReported) {
                if (isWrited) {
                    if (reportCount >= 9) {
                        const deleteQuery = `MATCH (c:Comment) WHERE c.commentID= ${commentID}
                        MATCH (c2:Comment) WHERE apoc.coll.contains(c2.path, c.commentID)
                        DETACH DELETE c DETACH DELETE c2`
                        await executeCypherQuery(deleteQuery)
                        return {
                            status: true, //false çevirilebilir
                            data: {},
                            message: 'Report count has achieved 10 so comment deleted',
                        }
                    } else {
                        const writeQuery = `MATCH (n:User) WHERE n.email = "${email}"
                                    MATCH (m:Comment) WHERE m.commentID = ${commentID}
                                    CREATE (n)-[r:REPORTED]->(m)
                                    SET m.report = m.report+1 RETURN r`
                        await executeCypherQuery(writeQuery)
                        return {
                            status: true,
                            data: { commentID },
                            message: 'Comment reported successfully',
                        }
                    }
                } else {
                    return {
                        status: false,
                        data: {},
                        message: 'User cannot report own comment',
                    }
                }
            } else {
                /*
                const writeQuery = `MATCH (n:User) WHERE n.email = "${email}"
                                    MATCH (m:Comment) WHERE m.commentID = ${commentID}
                                    MATCH (n)-[r:REPORTED]->(m)
                                    WITH m,r
                                    SET m.report = m.report-1 
                                    DELETE r`
                const writeResult = await executeCypherQuery(writeQuery)
                return {
                    status: true,
                    data: { commentID },
                    message: 'Report deleted successfully',
                }
                */
                return {
                    status: false,
                    data: { commentID },
                    message: 'An user cannot report twice',
                }
            }
        } catch (error) {
            return {
                status: false,
                data: {},
                message: `Something went wrong: ${error.message}`,
            }
        }
    },

    getCommentsModel: async ({ email, title }) => {
        try {
            const writeQuery = `MATCH (s:Survey) WHERE s.title = "${title}"
            MATCH (c1:Comment)-[:TO]->(s)
            MATCH (c:Comment) WHERE apoc.coll.contains(c.path,c1.commentID) = true
            MATCH (u:User)-[:WRITED]->(c) 
            RETURN u.name AS u, u.email = "${
                email ? email : 'hjkfhsghkudlfhvkjidhbvkjdshv'
            }" AS d, c ORDER BY c.upvote DESC, c.commentID DESC`
            const getupvotedsquery = `MATCH (c:Comment)-[:TO]->(s:Survey) WHERE s.title = "${title}"
            MATCH (u1:User)-[:UPVOTED]->(c1:Comment) WHERE apoc.coll.contains(c1.path,c.commentID) = true AND u1.email = "${email ? email : 'hjkfhsghkudlfhvkjidhbvkjdshv'}"
            RETURN DISTINCT(c1.commentID) AS c1 `
            const getreportedquery = `MATCH (c:Comment)-[:TO]->(s:Survey) WHERE s.title = "${title}"
            MATCH (u2:User)-[:REPORTED]->(c2:Comment) WHERE apoc.coll.contains(c2.path,c.commentID) = true AND u2.email = "${email ? email : 'hjkfhsghkudlfhvkjidhbvkjdshv'}"
            RETURN DISTINCT(c2.commentID) AS c2`             
            const writeResult = await executeCypherQuery(writeQuery)
            const resUpvoteds = await executeCypherQuery(getupvotedsquery)
            const resReporteds = await executeCypherQuery(getreportedquery)
            const names = writeResult.records.map((_rec) => _rec.get('u'))
            const deletable = writeResult.records.map((_rec) => _rec.get('d'))
            const comment = writeResult.records.map((_rec) => _rec.get('c').properties)
            const comments = comment.map((_comment, idx) => ({
                ..._comment,
                author: names[idx],
                deletable: deletable[idx],
            }))
            let upvoteds = []
            let reporteds = []
            upvoteds = resUpvoteds.records.map((_rec) => _rec.get('c1'))
            reporteds = resReporteds.records.map((_rec) => _rec.get('c2'))
            /*
            const names = writeResult.records.map((_rec) => _rec.get('u').properties)
            const comments = writeResult.records.map((_rec) => _rec.get('c').properties)
            const commentIDs = writeResult.records.map((_rec) => _rec.get('id').properties)
            const times = writeResult.records.map((_rec) => _rec.get('t').properties)
            const upvotes = writeResult.records.map((_rec) => _rec.get('up').properties)
            const reports = writeResult.records.map((_rec) => _rec.get('r').properties)
            */
            return {
                status: true,
                data: { comments, upvoteds, reporteds },
                message: 'Comments returned successfully',
            }
        } catch (error) {
            return {
                status: false,
                data: {},
                message: `Something went wrong: ${error.message}`,
            }
        }
    },

    deleteCommentsModel: async ({ email, commentID }) => {
        try {
            let writeQuery = `MATCH (u:User)-[r:WRITED]->(c:Comment)
            WHERE u.email = "${email}" AND c.commentID = ${commentID}
            MATCH (c2:Comment) WHERE apoc.coll.contains(c2.path, c.commentID)
            DETACH DELETE c DETACH DELETE c2`
            const writeResult = await executeCypherQuery(writeQuery)
            const result = writeResult.summary.counters.updates().nodesDeleted
            console.log(result)
            if (result == 0) {
                return {
                    status: false,
                    data: {},
                    message: 'User cannot delete other users comments',
                }
            } else {
                return {
                    status: true,
                    data: {},
                    message: 'Comment deleted successfully',
                }
            }
        } catch (error) {
            return {
                status: false,
                data: {},
                message: `Something went wrong: ${error.message}`,
            }
        }
    },
}
