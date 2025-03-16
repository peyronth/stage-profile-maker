import ProfileMaker from "stage-profile-maker";

async function fetchData(url) {
    const response = await fetch(url);
    return response.text();
}

async function loadGpx() {
    const gpxContent = await fetchData('/example/export.gpx');
    const profileMaker = new ProfileMaker(gpxContent);
    console.log(profileMaker);
}

loadGpx();


