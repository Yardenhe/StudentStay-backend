async function onGetStays() {
    const elPre = document.querySelector('pre')

    const res = await fetch('api/stay')
    const stays = await res.json()

    elPre.innerText = JSON.stringify(stays, null, 2)
}