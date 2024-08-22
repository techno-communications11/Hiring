import express from 'express'
import Login from '../components/Login.js'
import register from '../components/Register.js';
import market from '../components/RegisterMarket.js';
// import logout from '../components/Logout.js';
import Application from '../components/CandidateDetails.js';
import { GetMarkets } from '../components/GetMarkets.js';
import { GetPublicProfile } from '../components/GetPublicprofile.js';
import authenticateJWT from '../components/authenticateJwt.js';
import { UpdateStatus } from '../components/UpdateStatus.js';
import { GetProfileCounts } from '../components/GetProfileCounts.js';
import ProfileData from '../components/ProfileData.js';
import { GetProfiles } from '../components/GetProfiles.js';
import NewprofileCounts from '../components/NewProfileCounts.js';
// import {HostPost} from '../components/HostPost.js'
import { HostGet } from '../components/HostGet.js';
import { GetIndividualHost } from '../components/GetIndividualHost.js';
const authRouter=express.Router();
authRouter.post('/login',Login);
authRouter.post('/register',authenticateJWT,register);
authRouter.post('/market',authenticateJWT,market)
// authRouter.post('/logout',authenticateJWT,logout)
authRouter.post('/publicprofile',Application)
authRouter.get('/getmarkets',GetMarkets)
authRouter.get('/getpublicprofile',authenticateJWT,GetPublicProfile)
authRouter.put('/updatestatus',authenticateJWT,UpdateStatus)
authRouter.get('/profilecounts',authenticateJWT,GetProfileCounts)
authRouter.get('/profile',authenticateJWT,ProfileData)
authRouter.get('/getprofiles',authenticateJWT,GetProfiles)
authRouter.get('/newCounts',authenticateJWT,NewprofileCounts)
// authRouter.post('/host-post',authenticateJWT,HostPost)
authRouter.get('/host-get',authenticateJWT,HostGet)
authRouter.get('/getHost',authenticateJWT,GetIndividualHost)
export default authRouter