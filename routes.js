const express = require('express')
const multer  = require('multer')
const router = express.Router()

const userCtrl = require('./controllers/user');
const venueCtrl = require('./controllers/venueCtrl.js');
const bridalCtrl = require('./controllers/bridal.js');
const bridalwearCtrl = require('./controllers/bridalwear.js');
const photographerCtrl = require('./controllers/photographerCtrl.js');
const groomCtrl =  require('./controllers/groomCtrl.js');
const mehndiCtrl = require('./controllers/mehndiCtrl.js')
const plannerCtrl = require('./controllers/plannerCtrl.js')

const blogCtrl = require('./controllers/blogCtrl.js')
const catsCtrl = require('./controllers/catsCtrl.js')
const inhouseCtrl = require('./controllers/inhouseCtrl.js')
const vendorCtrl = require('./controllers/vendorCtrl.js')
const testCtrl = require('./controllers/testimonialsCtrl.js')
const contactCtrl = require('./controllers/contactCtrl.js')
const likeCtrl = require('./controllers/likeCtrl.js')
const ratingCtrl = require('./controllers/ratingCtrl.js')
const mainCtrl = require('./controllers/mainCtrl.js')


const adminCtrl = require('./controllers/adminCtrl.js')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
var upload = multer({ storage: storage })

  

// routes
router.post('/login', userCtrl.login );
router.post('/register', userCtrl.register );
router.post('/onboarding', userCtrl.onboarding );
router.post('/verify-register', userCtrl.verifyregisteration );
router.post('/verify-onboarding', userCtrl.verifyonboarding );
router.post('/forget-password', userCtrl.frgtPassword );
router.post('/change-password', userCtrl.changePassword );

router.post('/update-profile', userCtrl.updateProfile );
router.post('/update-password', userCtrl.updatePassword );
router.post('/delete-user', userCtrl.deleteUser );


router.post('/recover-password', userCtrl.rcvrPassword );
router.post('/social', userCtrl.socialSign );
router.post('/profile', userCtrl.profile );
router.post('/user/pic', upload.array('userPic'), userCtrl.profilePic );



router.post('/venue/create', venueCtrl.create );
router.post('/venue/image/upload/:id', upload.array('images'), venueCtrl.imageUpload );
router.post('/venue/image/delete/:id', venueCtrl.imageDelete );
router.post('/venue/update', venueCtrl.update );
router.post('/venues',  venueCtrl.list );
router.post('/venue/:id',  venueCtrl.details );
router.post('/venue/delete/:id',  venueCtrl.delete );


router.post('/bridal-makeup/create', bridalCtrl.create );
router.post('/bridal-makeup/image/upload/:id', upload.array('images'), bridalCtrl.imageUpload );
router.post('/bridal-makeup/image/delete/:id', bridalCtrl.imageDelete );
router.post('/bridal-makeup/update', bridalCtrl.update );
router.post('/bridal-makeups',  bridalCtrl.list );
router.post('/bridal-makeup/:id',  bridalCtrl.details );
router.post('/bridal-makeup/delete/:id',  bridalCtrl.delete );

router.post('/bridal-wear/create',bridalwearCtrl.create );
router.post('/bridal-wear/image/upload/:id', upload.array('images'), bridalwearCtrl.imageUpload );
router.post('/bridal-wear/image/delete/:id', bridalwearCtrl.imageDelete );
router.post('/bridal-wear/update', bridalwearCtrl.update );
router.post('/bridal-wears',  bridalwearCtrl.list );
router.post('/bridal-wear/:id',  bridalwearCtrl.details );
router.post('/bridal-wear/delete/:id',  bridalwearCtrl.delete );

router.post('/photographer/create', photographerCtrl.create );
router.post('/photographer/image/upload/:id', upload.array('images'), photographerCtrl.imageUpload );
router.post('/photographer/image/delete/:id', photographerCtrl.imageDelete );
router.post('/photographer/update', photographerCtrl.update );
router.post('/photographers',  photographerCtrl.list );
router.post('/photographer/:id',  photographerCtrl.details );
router.post('/photographer/delete/:id',  photographerCtrl.delete );

router.post('/groom/create',  groomCtrl.create );
router.post('/groom/image/upload/:id', upload.array('images'), groomCtrl.imageUpload );
router.post('/groom/image/delete/:id', groomCtrl.imageDelete );
router.post('/groom/update', groomCtrl.update );
router.post('/groom',  groomCtrl.list );
router.post('/groom/:id',  groomCtrl.details );
router.post('/groom/delete/:id',  groomCtrl.delete );

router.post('/mehndi/create',mehndiCtrl.create );
router.post('/mehndi/image/upload/:id', upload.array('images'), mehndiCtrl.imageUpload );
router.post('/mehndi/image/delete/:id', mehndiCtrl.imageDelete );
router.post('/mehndi/update', mehndiCtrl.update );
router.post('/mehndi',  mehndiCtrl.list );
router.post('/mehndi/:id',  mehndiCtrl.details );
router.post('/mehndi/delete/:id',  mehndiCtrl.delete );

router.post('/planner/create',  plannerCtrl.create );
router.post('/planner/image/upload/:id', upload.array('images'), plannerCtrl.imageUpload );
router.post('/planner/image/delete/:id', plannerCtrl.imageDelete );
router.post('/planner/update', plannerCtrl.update );
router.post('/planner',  plannerCtrl.list );
router.post('/planner/:id',  plannerCtrl.details );
router.post('/planner/delete/:id',  plannerCtrl.delete );

router.get('/blogs',  blogCtrl.list );
router.get('/blog/:id',  blogCtrl.details );

router.get('/categories/popular', catsCtrl.popBlog)
router.get('/categories',  catsCtrl.list );
router.get('/inhouse',  inhouseCtrl.list );

router.get('/vendors',  vendorCtrl.list );
router.get('/videos',  vendorCtrl.videos );
router.get('/images',  vendorCtrl.images );

router.post('/like', likeCtrl.like );
router.post('/unlike',  likeCtrl.unlike );
router.post('/likelist',  likeCtrl.list );


router.get('/testimonials', testCtrl.list)
router.post('/contact-us', contactCtrl.doContact)

router.post('/message-us', contactCtrl.doMessage)
router.post('/verify-message', contactCtrl.verifymessage)

router.post('/search', vendorCtrl.searchVendors)


router.post('/add-rating', ratingCtrl.add)
router.post('/list-rating', ratingCtrl.list)

router.post('/cities', mainCtrl.cities)
router.post('/areas', mainCtrl.areas)



/* admin */

router.post('/admin/login', adminCtrl.login)


module.exports = router