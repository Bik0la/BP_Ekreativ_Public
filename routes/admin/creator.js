// Kontrolujeme isAuthorized, do creatoru mohou pouze přihlášení uživatelé.
const {isAuthorized} = require("../../services/authentication");

var express = require('express');
const courseModel = require('../../models/course');
var router = express.Router();

// Úvodní get pro načtení stránky - renderujeme pak view
// se všemy kurzy, načítáme aktuálně přihlášeného uživatele a zakazujeme editaci, kvůli správnému zobrazení šablony.
router.get('/admin/creator', isAuthorized, async function (req, res, next) {
    const courses = await courseModel.find()
    res.render('admin/creator', {courses: courses, user: req.user, isEditing: false});
});

// Post pro vytvoření kurzu. Jsou zde kontroly, aby se nevytvořil duplicitní kurz, případně chytáme i jiné chyby.
// Děláme novou instanci kurzu z modelu a ten poté po validaci ukládáme do db. Redirect vždy zpět na aktuální stránku.
router.post('/admin/creator', isAuthorized, async function (req, res, next) {
    const {courseTitle, courseThumbnail, courseCategory, courseBody} = req.body


    const course = await courseModel.findOne({title: courseTitle})
    if (!!course?.title) {
        await req.flash('error', `Kurz se stejným názvem již existuje!`);
        res.redirect('/admin/creator');
        return;
    }

    const courseToBeCreated = new courseModel({
        title: courseTitle,
        thumbnailUrl: courseThumbnail,
        mainText: courseBody,
        categoryName: courseCategory,
        authorId: req.user._id,
    })

    try {
        await courseToBeCreated.save()
    } catch (e) {
        console.log(e)
        await req.flash('error', `Při vytváření kurzu došlo k chybě!`);
        res.redirect('/admin/creator');
        return;
    }

    await req.flash('info', `Kurz byl úspešně vytvořen!`);
    res.redirect('/admin/creator');
});

// Post pro smazání kurzu. Kontroluje se, zdali kurz vůbec existuje a také validujeme, zdali je AuthorID kurzu totožné s UserID uživatele.
// Pokud nejsou ID totožné, zamezíme smazání.
router.post('/admin/creator/course/:courseId/delete', isAuthorized, async function (req, res, next) {
    const courseId = req.params.courseId
    const userHere = req.user;

    const course = await courseModel.findOne({_id: courseId})
    if (!course?._id) {
        await req.flash('error', `Kurz se nepodařilo smazat. Požadovaný kurz nebyl nalezen!`);
        res.redirect('/admin/creator');
        return;
    }


    if (userHere._id.trim !== course.authorId.trim) {
        console.log(userHere._id);
        console.log(course.authorId);
        await req.flash('error', `Nejste autorem kurzu!`);
        res.redirect('/admin/creator');
        return;
    }

    try {
        await courseModel.findByIdAndDelete(courseId)
    } catch (e) {
        console.log(e)
        await req.flash('error', `Při mazání kurzu došlo k chybě!`);
        res.redirect('/admin/creator');
        return;
    }

    await req.flash('info', `Kurz byl úspešně vymazán!`);
    res.redirect('/admin/creator');
});

// Get pro editaci. Načítáme si z req. potřebná data, resp. titulek, url obrázku a celý text -
// Ten se nahraje pak v POSTu zpět do formuláře, upravíme ho, ošetříme automatické chyby a uložíme/nahradíme.
router.get('/admin/creator/course/:courseId/edit', isAuthorized, async function (req, res, next) {
    const courseId = req.params.courseId
    const courses = await courseModel.find()
    const userHere = req.user;

    const course = await courseModel.findOne({_id: courseId})
    if (!course?._id) {
        await req.flash('error', `Požadovaný kurz nebyl nalezen!`);
        res.redirect('/admin/creator');
        return;
    }



    if (userHere._id.trim !== course.authorId.trim) {
        await req.flash('error', `Nejste autorem kurzu!`);
        console.log(userHere._id);
        console.log(course.authorId);
        res.redirect('/admin/creator');
        return;
    }

    res.render('admin/creator', {courses: courses, user: req.user, editedCourse: course, isEditing: true});
});

// Post pro editaci - načteme věci z těla, zkontrolujeme chyby jako nenalezení kurzu atp, a poté nahradíme stávající kurz
router.post('/admin/creator/course/:courseId/edit', isAuthorized, async function (req, res, next) {
    const courseId = req.params.courseId
    const {courseTitle, courseThumbnail, courseCategory, courseBody} = req.body


    let course = await courseModel.findOne({_id: courseId})
    if (!course?._id) {
        await req.flash('error', `Požadovaný kurz nebyl nalezen!`);
        res.redirect('/admin/creator');
        return;
    }

    if (course.title !== courseTitle) {
        course = await courseModel.findOne({title: courseTitle})
        if (!!course?.title) {
            await req.flash('error', `Kurz se stejným názvem již existuje!`);
            res.redirect(`/admin/creator/course/${courseId}/edit`);
            return;
        }
    }

    try {
        await courseModel.updateOne({_id: courseId}, {
            title: courseTitle,
            mainText: courseBody,
            thumbnailUrl: courseThumbnail,
            categoryName: courseCategory,
            authorId: req.user._id
        })
    } catch (e) {
        console.log(e)
        await req.flash('error', `Při úpravě kurzu došlo k chybě!`);
        res.redirect(`/admin/creator/course/${courseId}/edit`);

        return;
    }

    res.redirect('/admin/creator');
});


module.exports = router;