const express = require('express');
const router = express.Router();
const { Users } = require('../models')


// 회원가입 
router.post('/test', async(req,res)=> {
    const {loginId, password, nickname, gender, address, phone, teamName, score, drop } = req.body
    const result = await Users.create(loginId, password, nickname, gender, address, phone, teamName, score, drop)
    console.log(result)
    res.send(result)
})

// 회원정보 조회 - 팀 목록
router.get('/test/:userId', async(req, res)=> {
    const {userId} = req.params
    const data = await Users.findOne({
        attributes: ['teamName', 'loginId'],
        where: { userId }
    })
    const teams = data.teamName.team
    res.send(teams)
})

// 팀 수정 - 추가
router.put('/test1/:userId', async(req,res)=>{
    const {userId} = req.params
    const {add} = req.body
    const data = await Users.findOne({
        attributes: ['teamName'],
        where: { userId }
    })
    const team = data.teamName.team
    team.push(add)
    const newTeam = {"team" : team}
    await Users.update({
        teamName: newTeam
    },
    {
        where: { userId }
    })
    res.send(team)
})

// 팀 수정 - 삭제
router.put('/test2/:userId', async(req,res)=>{
    const {userId} = req.params
    const {remove} = req.body
    const data = await Users.findOne({
        attributes: ['teamName'],
        where: { userId }
    })
    const team = data.teamName.team
    const idx = team.indexOf(remove)
    team.splice(idx, 1)
    const newTeam = {"team" : team}
    await Users.update({
        teamName: newTeam
    },
    {
        where: { userId}
    })
    res.send(team)
})


module.exports = router;