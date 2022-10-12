const body = document.querySelector('body');
const navContainer = document.getElementById('navContainer');
const navbarToggler = document.getElementById('navbarToggler');
const backProjectBtn = document.getElementById('backProjectBtn');
const bookmarkProjectBtn = document.getElementById('bookmarkProjectBtn');
const bookmarkProjectText = document.getElementById('bookmarkProjectText');
const totalAmountEl = document.getElementById('totalAmount');
const maxTotalAmountEl = document.getElementById('maxTotalAmount');
const totalBackersEl = document.getElementById('totalBackers');
const progressBar = document.getElementById('progressBar');
const selectPlanBtns = document.querySelectorAll('.plan__btn');
const selectionModal = document.getElementById('selectionModalContainer');
const successModal = document.getElementById('successModalContainer');
const selectionModalCloseBtn = document.getElementById('selectionModalCloseBtn');
const successModalCloseBtn = document.getElementById('successModalCloseBtn');
const selectionPlans = document.querySelectorAll('.selection__plan');
const selectionPlanHeaders = document.querySelectorAll('.selection__plan-header');
const freeEditionForm = document.getElementById('freeEditionForm');
const bambooEditionForm = document.getElementById('bambooEditionForm');
const blackEditionForm = document.getElementById('blackEditionForm');

let totalAmount = JSON.parse(localStorage.getItem('totalAmount')) || 89914;
let maxTotalAmount = 100000;
let totalBackers = JSON.parse(localStorage.getItem('totalBackers')) || 5007;

let bookmarkStatus = JSON.parse(localStorage.getItem('bookmarkStatus')) || false;

document.addEventListener('DOMContentLoaded', () => initApp());

const initApp = () => {

    navbarToggler.addEventListener('click', toggleNav);
    backProjectBtn.addEventListener('click', openSelectionModal);
    bookmarkProjectBtn.addEventListener('click', toggleBookmarkStatus);

    checkToggleBookmarkStatus();

    selectPlanBtns.forEach(selectPlanBtn => {
        selectPlanBtn.addEventListener('click', openSelectionModalWithReward);
    });

    selectionModalCloseBtn.addEventListener('click', closeSelectionModal);
    successModalCloseBtn.addEventListener('click', closeSuccessModal);

    selectionPlanHeaders.forEach(selectionPlanHeader => {
        selectionPlanHeader.addEventListener('click', activateSelectionPlan);
    });

    freeEditionForm.addEventListener('submit', sendPledgeWithoutReward);
    bambooEditionForm.addEventListener('submit', sendPledge);
    blackEditionForm.addEventListener('submit', sendPledge);

    totalAmountEl.textContent = `$${formatNumber(totalAmount)}`;
    maxTotalAmountEl.textContent = `of $${formatNumber(maxTotalAmount)} backed`;
    totalBackersEl.textContent = formatNumber(totalBackers);

    updateProgressBar(totalAmount, maxTotalAmount);

}

const toggleNav = () => {

    navContainer.classList.toggle('nav__container--open');

}

const toggleBookmarkStatus = (e) => {

    bookmarkStatus = bookmarkStatus ? false : true;

    localStorage.setItem('bookmarkStatus', bookmarkStatus);

    bookmarkProjectBtn.classList.toggle('btn--bookmarked-active');
    
    if (bookmarkStatus) {
        bookmarkProjectText.textContent = 'Bookmarked';
    } else {
        bookmarkProjectText.textContent = 'Bookmark';
    }

}

const checkToggleBookmarkStatus = () => {

    if (bookmarkStatus) {
        bookmarkProjectBtn.classList.add('btn--bookmarked-active');
        bookmarkProjectText.textContent = 'Bookmarked';
    } 

}

const openSelectionModal = () => {

    body.style.overflowY = 'hidden';
    selectionModal.classList.add('modal__container--show');

}

const openSelectionModalWithReward = (e) => {

    const selectedPlan = e.target.dataset.plan;
    const selectionPlan = document.getElementById(`${selectedPlan}EditionPlan`);

    body.style.overflowY = 'hidden';
    selectionModal.classList.add('modal__container--show');
    selectionPlan.classList.add('selection__plan--active');

}

const resetSelectionPlans = () => {

    selectionPlans.forEach(selectionPlan => {
        selectionPlan.classList.remove('selection__plan--active');
        selectionPlan.querySelector('.pledge__form').reset();
        selectionPlan.querySelector('.pledge__cta').classList.remove('pledge__cta--invalid');
    }); 

}

const closeSelectionModal = () => {

    body.style.overflowY = 'unset';
    selectionModal.classList.remove('modal__container--show');

    resetSelectionPlans();

}

const closeSuccessModal = () => {

    body.style.overflowY = 'unset';
    successModal.classList.remove('modal__container--show');

}

const activateSelectionPlan = (e) => {

    resetSelectionPlans();

    const selectedPlan = e.target;

    if (selectedPlan.classList.contains('selection__plan-header')) {
        selectedPlan.parentNode.parentNode.classList.add('selection__plan--active');
    } else if (selectedPlan.classList.contains('selection__plan-info') || selectedPlan.classList.contains('selection__plan-circle')){
        selectedPlan.parentNode.parentNode.parentNode.classList.add('selection__plan--active');
    } else {
        selectedPlan.parentNode.parentNode.parentNode.parentNode.classList.add('selection__plan--active');
    }

}

const sendPledgeWithoutReward = (e) => {

    e.preventDefault();

    finishSendProcess(0);

}

const sendPledge = (e) => {

    e.preventDefault();

    const input = e.target.querySelector('.pledge__qty');
    const minValue = +input.dataset.min;
    
    if (input.value < minValue) {

        input.parentNode.classList.add('pledge__cta--invalid');
        input.nextElementSibling.textContent = `Pledge must be ${minValue} or more`;
        return;
    }

    input.parentNode.classList.remove('pledge__cta--invalid');
    input.nextElementSibling.textContent = '';

    finishSendProcess(+input.value);
    
}

const finishSendProcess = (pledgeQty) => {

    totalAmount = totalAmount + pledgeQty;
    totalBackers = totalBackers + 1;
    totalAmountEl.textContent = `$${formatNumber(totalAmount)}`
    totalBackersEl.textContent = formatNumber(totalBackers);

    localStorage.setItem('totalAmount', totalAmount);
    localStorage.setItem('totalBackers', totalBackers);

    updateProgressBar(totalAmount, maxTotalAmount);

    resetSelectionPlans();

    selectionModal.classList.remove('modal__container--show');

    setTimeout(() => {
        successModal.classList.add('modal__container--show');
    }, 450);

}

const formatNumber = (number) => {

    return new Intl.NumberFormat().format(number);

}

const updateProgressBar = (totalAmount, maxTotalAmount) => {

    const percentOfTarget = ((totalAmount * 100) / maxTotalAmount).toFixed(0);

    if (percentOfTarget >= 100) {
        progressBar.style.width = "100%";
        return;
    }
    
    progressBar.style.width =`${percentOfTarget}%`;

}

