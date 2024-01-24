const knownAnnotators = {
    22: 'Jeff Drazen',
    24: 'Meagan Putts',
    25: 'Sarah Bingo',
    332: 'Nikki Cunanan',
    433: 'Aaron Judah',
};

$('#annotationTable tbody').remove();
$('#annotationTable').append('<tbody class="text-start"></tbody>');

for (const localization of localizations) {
    console.log(localization);
    $('#annotationTable').find('tbody').append(`
        <tr>
            <td class="ps-5">
                <div class="row">
                    <div class="col-5">
                        Scientific Name:
                    </div>
                    <div class="col values">
                        ${localization.scientific_name}<br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        Count:
                    </div>
                    <div class="col values">
                        ${localization.count}<br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        Annotator:
                    </div>
                    <div class="col values">
                        ${knownAnnotators[localization.annotator]}<br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        Attracted:
                    </div>
                    <div class="col values">
                        ${localization.attracted}<br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        Qualifier:
                    </div>
                    <div class="col values">
                        ${localization.qualifier}<br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        Categorical Abundance:
                    </div>
                    <div class="col values">
                        ${localization.categorical_abundance}<br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        Reason:
                    </div>
                    <div class="col values">
                        ${localization.reason}<br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        Tentative ID:
                    </div>
                    <div class="col values">
                        ${localization.tentative_id}<br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        Identification Remarks:
                    </div>
                    <div class="col values">
                        ${localization.identification_remarks}<br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        Identified By:
                    </div>
                    <div class="col values">
                        ${localization.identified_by}<br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        Notes:
                    </div>
                    <div class="col values">
                        ${localization.notes}<br>
                    </div>
                </div>
                <br>
                <a class="editButton" href="https://cloud.tator.io/26/annotation/${localization.media_id}?frame=${localization.frame}" target="_blank">View on Tator</a>
            </td>
            <td class="text-center">
                <a href="${localization.frame_url}" target="_blank">
                    <div id="${localization.id}_image" class="position-relative" style="width: 580px;">
                        <img src="${localization.frame_url}" style="width: 580px;" alt="${localization.scientific_name}"/>
                        <div id="${localization.id}_overlay">
                        ${localization.type === 49
                            ? localization.points.map((point) => {
                                return `<span class="position-absolute tator-dot" style="top: ${point[1] * 100}%; left: ${point[0] * 100}%;"></span>`;
                            }).join('')
                            : `<span
                                class="position-absolute tator-box"
                                style="top: ${localization.points[0][1] * 100}%; left: ${localization.points[0][0] * 100}%; width: ${localization.dimensions[0] * 100}%; height: ${localization.dimensions[1] * 100}%;"
                            ></span>`
                        }
                        </div>
                    </div>
                </a>
            </td>
        </tr>
    `);

    $(`#${localization.id}_overlay`).css('opacity', '0.5');
    $(`#${localization.id}_image`).hover((e) => {
        if (e.type === 'mouseenter') {
            $(`#${localization.id}_overlay`).css('opacity', '1.0');
        }
        else if (e.type === 'mouseleave') {
            $(`#${localization.id}_overlay`).css('opacity', '0.5');
        }
    });
}

// get rid of loading screen if back button is pressed (mozilla)
$(window).bind('pageshow', (event) => {
    $('#load-overlay').removeClass('loader-bg');
    $('#load-overlay').addClass('loader-bg-hidden');
});
