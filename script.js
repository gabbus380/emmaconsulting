// jQuery Document Ready
$(document).ready(function() {
    
    // ===========================
    // Smooth Scrolling for Navigation Links
    // ===========================
    $('.nav-link, .btn[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        
        if(target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000, 'swing');
        }
    });
    
    // ===========================
    // Navbar Scroll Effect
    // ===========================
    $(window).on('scroll', function() {
        if($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });
    
    // ===========================
    // Mobile Menu Toggle
    // ===========================
    $('.mobile-menu-toggle').on('click', function() {
        $(this).toggleClass('active');
        $('.nav-menu').toggleClass('mobile-active');
    });
    
    // Close mobile menu when clicking on a link
    $('.nav-link').on('click', function() {
        $('.mobile-menu-toggle').removeClass('active');
        $('.nav-menu').removeClass('mobile-active');
    });
    
    // ===========================
    // Active Navigation Link on Scroll
    // ===========================
    $(window).on('scroll', function() {
        let scrollPos = $(document).scrollTop() + 100;
        
        $('.nav-link').each(function() {
            let currLink = $(this);
            let refElement = $(currLink.attr('href'));
            
            if(refElement.length) {
                if(refElement.offset().top <= scrollPos && 
                   refElement.offset().top + refElement.outerHeight() > scrollPos) {
                    $('.nav-link').removeClass('active');
                    currLink.addClass('active');
                } else {
                    currLink.removeClass('active');
                }
            }
        });
    });
    
    // ===========================
    // Fade In Elements on Scroll
    // ===========================
    function fadeInOnScroll() {
        $('.about-card, .service-card, .expertise-card').each(function() {
            let elementTop = $(this).offset().top;
            let elementBottom = elementTop + $(this).outerHeight();
            let viewportTop = $(window).scrollTop();
            let viewportBottom = viewportTop + $(window).height();
            
            if(elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('fade-in-up');
            }
        });
    }
    
    $(window).on('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Run on page load
    
    // ===========================
    // Contact Form Submission
    // ===========================
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = $('#name').val();
        const email = $('#email').val();
        const organization = $('#organization').val();
        const message = $('#message').val();
        const turnstileResponse = $('.cf-turnstile textarea[name="cf-turnstile-response"]').val();
        
        // Validation
        if(!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        if(!turnstileResponse) {
            alert('Please complete the security verification.');
            return;
        }
        
        // Disable submit button
        const $submitBtn = $('#submitBtn');
        $submitBtn.prop('disabled', true).text('Sending...');
        
        // Send to Cloudflare Worker
        $.ajax({
            url: '/api/contact',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                email: email,
                organization: organization,
                message: message,
                'cf-turnstile-response': turnstileResponse
            }),
            success: function(response) {
                alert('Thank you for your message! We will get back to you shortly.');
                $('#contactForm')[0].reset();
                // Reset Turnstile
                if(typeof turnstile !== 'undefined') {
                    turnstile.reset();
                }
            },
            error: function(xhr, status, error) {
                alert('Sorry, there was an error sending your message. Please try again or email us directly at office@emmaconsulting.space');
                console.error('Error:', error);
            },
            complete: function() {
                $submitBtn.prop('disabled', false).text('Send Message');
            }
        });
    });
    
    // ===========================
    // Parallax Effect for Hero Background
    // ===========================
    $(window).on('scroll', function() {
        let scrolled = $(window).scrollTop();
        $('.hero-background').css('transform', 'translateY(' + (scrolled * 0.5) + 'px)');
    });
    
    // ===========================
    // Stats Counter Animation
    // ===========================
    let statsAnimated = false;
    
    function animateStats() {
        if(!statsAnimated && isElementInViewport($('.hero-stats')[0])) {
            statsAnimated = true;
            
            $('.stat-item').each(function(index) {
                $(this).delay(index * 100).animate({
                    opacity: 1
                }, 600);
            });
        }
    }
    
    function isElementInViewport(el) {
        if(!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    $(window).on('scroll', animateStats);
    animateStats(); // Check on page load
    
    // ===========================
    // Smooth Appearance for Cards
    // ===========================
    $('.service-card, .about-card, .expertise-card').css('opacity', '0');
    
    $(window).on('scroll', function() {
        $('.service-card, .about-card, .expertise-card').each(function(index) {
            let cardTop = $(this).offset().top;
            let windowBottom = $(window).scrollTop() + $(window).height();
            
            if(windowBottom > cardTop + 100) {
                setTimeout(() => {
                    $(this).css({
                        'opacity': '1',
                        'transform': 'translateY(0)'
                    });
                }, index * 100);
            }
        });
    }).trigger('scroll'); // Trigger on page load
    
    // ===========================
    // Add Hover Effects
    // ===========================
    $('.service-card').hover(
        function() {
            $(this).find('.service-number').css('opacity', '1');
        },
        function() {
            $(this).find('.service-number').css('opacity', '0.5');
        }
    );
    
});

// ===========================
// Vanilla JS - Page Load Animation
// ===========================
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

