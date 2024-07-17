$(document).ready(function() {
    // Initialize date picker
    $('#date-picker').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true,
        startDate: '+1d' // Set start date to tomorrow
    }).on('changeDate', function(e) {
        let selectedDate = e.date;
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            $('#date-picker').datepicker('setDate', '+1d');
        }

        // Update time picker options based on selected date
        updatePickerOptions(selectedDate);

        resetCountdown();
    });

    // Generate hour, minute, second options
    generateTimeOptions();

    // Start countdown button click event
    $('#start-button').click(function() {
        startCountdown();
    });

    // Countdown function
    function startCountdown() {
        let selectedDate = $('#date-picker').datepicker('getDate');
        if (!selectedDate) {
            showErrorModal('Please select a date first.');
            return;
        }

        let selectedHour = $('#hour-picker').val() || 0;
        let selectedMinute = $('#minute-picker').val() || 0;
        let selectedSecond = $('#second-picker').val() || 0;

        // Convert selected time to Thai time
        let thaiTimeOffset = 7 * 60; // Thailand Standard Time is UTC+7
        selectedDate.setHours(selectedHour, selectedMinute, selectedSecond);
        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset() + thaiTimeOffset);

        startCountdownTimer(selectedDate);
    }

    // Update time picker options based on selected date
    function updatePickerOptions(selectedDate) {
        let now = new Date();
        let thaiTimeOffset = 7 * 60; // Thailand Standard Time is UTC+7

        if (selectedDate.getTime() === now.getTime()) {
            // Disable past hours if current date and time
            let currentHour = now.getHours();
            $('#hour-picker option').each(function() {
                if ($(this).val() < currentHour) {
                    $(this).prop('disabled', true);
                } else {
                    $(this).prop('disabled', false);
                }
            });
        } else {
            // Enable all hours
            $('#hour-picker option').prop('disabled', false);
        }

        // Enable all minutes and seconds
        $('#minute-picker option, #second-picker option').prop('disabled', false);
    }

    // Generate hour, minute, second options
    function generateTimeOptions() {
        let hourPicker = $('#hour-picker');
        let minutePicker = $('#minute-picker');
        let secondPicker = $('#second-picker');

        for (let i = 0; i < 24; i++) {
            hourPicker.append($('<option>', {
                value: i,
                text: formatThaiTime(i)
            }));
        }

        for (let i = 0; i < 60; i++) {
            minutePicker.append($('<option>', {
                value: i,
                text: i < 10 ? '0' + i : i
            }));
            secondPicker.append($('<option>', {
                value: i,
                text: i < 10 ? '0' + i : i
            }));
        }
    }

    // Countdown function
    function startCountdownTimer(targetDate) {
        let daysElem = $('#days');
        let hoursElem = $('#hours');
        let minutesElem = $('#minutes');
        let secondsElem = $('#seconds');

        clearInterval(countdownInterval);

        countdownInterval = setInterval(function() {
            let now = new Date();
            // Convert the current time to Thai time
            let thaiTimeOffset = 7 * 60; // Thailand Standard Time is UTC+7
            now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + thaiTimeOffset);

            let distance = targetDate - now;

            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysElem.text(days < 10 ? '0' + days : days);
            hoursElem.text(formatThaiTime(now.getHours()));
            minutesElem.text(minutes < 10 ? '0' + minutes : minutes);
            secondsElem.text(seconds < 10 ? '0' + seconds : seconds);

            if (distance < 0) {
                clearInterval(countdownInterval);
                $('.countdown').html("EXPIRED");
            }
        }, 1000);
    }

    // Format hours in Thai time format (24-hour)
    function formatThaiTime(hours) {
        return hours < 10 ? '0' + hours : hours.toString();
    }

    // Show error modal with specified message
    function showErrorModal(message) {
        $('#errorModalBody').text(message);
        $('#errorModal').modal('show');
    }

    // Reset countdown function
    function resetCountdown() {
        $('#days, #hours, #minutes, #seconds').text('00');
        clearInterval(countdownInterval);
    }

    let countdownInterval;
});