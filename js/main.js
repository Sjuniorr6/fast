let countersStarted = false;
        let countersReverseStarted = false;

        function animateCounters(reverse = false) {
            document.querySelectorAll('.counter').forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                const duration = 2000;
                const frameRate = 60;
                const totalFrames = Math.round(duration / (1000 / frameRate));
                let increment, current, displayValue;
                if (suffix === 'K+') {
                    increment = (target * 1000) / totalFrames;
                    current = reverse ? target * 1000 : 0;
                } else {
                    increment = target / totalFrames;
                    current = reverse ? target : 0;
                }

                function update() {
                    if (!reverse && current < (suffix === 'K+' ? target * 1000 : target)) {
                        current += increment;
                        if (current > (suffix === 'K+' ? target * 1000 : target)) current = (suffix === 'K+' ? target * 1000 : target);
                        if (suffix === 'K+') {
                            displayValue = Math.floor(current / 1000) + 'K+';
                        } else {
                            displayValue = Math.floor(current) + suffix;
                        }
                        counter.textContent = displayValue;
                        requestAnimationFrame(update);
                    } else if (reverse && current > 0) {
                        current -= increment;
                        if (current < 0) current = 0;
                        if (suffix === 'K+') {
                            displayValue = Math.floor(current / 1000) + 'K+';
                        } else {
                            displayValue = Math.floor(current) + suffix;
                        }
                        counter.textContent = displayValue;
                        requestAnimationFrame(update);
                    } else {
                        if (!reverse) {
                            if (suffix === 'K+') {
                                counter.textContent = target + 'K+';
                            } else {
                                counter.textContent = target + suffix;
                            }
                        } else {
                            if (suffix === 'K+') {
                                counter.textContent = '0K+';
                            } else {
                                counter.textContent = '0' + suffix;
                            }
                        }
                    }
                }
                update();
            });
        }

        function revealOnScroll() {
            document.querySelectorAll('.scroll-reveal').forEach(el => {
                const windowHeight = window.innerHeight;
                const elementTop = el.getBoundingClientRect().top;
                const elementBottom = el.getBoundingClientRect().bottom;
                const elementVisible = 150;
                // Seção visível
                if (elementTop < windowHeight - elementVisible && elementBottom > elementVisible) {
                    el.classList.add('visible');
                    if (el.querySelector('.counter') && !countersStarted) {
                        countersStarted = true;
                        countersReverseStarted = false;
                        animateCounters(false);
                    }
                } else {
                    el.classList.remove('visible');
                    // Seção não visível
                    if (el.querySelector('.counter') && !countersReverseStarted) {
                        countersReverseStarted = true;
                        countersStarted = false;
                        animateCounters(true);
                    }
                }
            });
        }
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll();

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
            anchor.addEventListener('click',e=>{
                e.preventDefault();
                const target=document.querySelector(anchor.getAttribute('href'));
                if(target){target.scrollIntoView({behavior:'smooth',block:'start'});} }); });

        // Particles
        function createParticle(){
            const p=document.createElement('div');
            p.className='particle';
            p.style.left=Math.random()*window.innerWidth+'px';
            const size=Math.random()*6+2;
            p.style.width=size+'px';
            p.style.height=size+'px';
            p.style.animationDuration=Math.random()*3+5+'s';
            document.getElementById('particles').appendChild(p);
            setTimeout(()=>p.remove(),8000);
        }
        setInterval(createParticle,500);

        // Typing cursor remove
        setTimeout(()=>{
            const typing=document.querySelector('.typing-effect');
            if(typing){typing.style.borderRight='none';}
        },4500);

        const services = [
            'Digital',
            'Banners',
            'Cartões',
            'Adesivos',
            'Brindes'
        ];
        let typeIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typewriterEl = document.getElementById('typewriter');
        function typeWriterLoop() {
            if (!typewriterEl) return;
            const current = services[typeIndex];
            if (isDeleting) {
                typewriterEl.textContent = current.substring(0, charIndex--);
                if (charIndex < 0) {
                    isDeleting = false;
                    typeIndex = (typeIndex + 1) % services.length;
                    setTimeout(typeWriterLoop, 600);
                } else {
                    setTimeout(typeWriterLoop, 40);
                }
            } else {
                typewriterEl.textContent = current.substring(0, charIndex++);
                if (charIndex > current.length) {
                    isDeleting = true;
                    setTimeout(typeWriterLoop, 1200);
                } else {
                    setTimeout(typeWriterLoop, 80);
                }
            }
        }
        typeWriterLoop();

        // HERO background rotativo com fade + zoom para 3 imagens
        (function() {
            const heroBgs = [
                document.getElementById('hero-bg-1'),
                document.getElementById('hero-bg-2'),
                document.getElementById('hero-bg-3')
            ];
            let current = 0;
            function showHeroBg(idx) {
                heroBgs.forEach((el, i) => {
                    if (el) {
                        if (i === idx) {
                            el.classList.remove('opacity-0');
                            el.classList.add('opacity-100');
                            el.classList.remove('scale-110', 'scale-105');
                            el.classList.add('scale-100');
                        } else {
                            el.classList.remove('opacity-100');
                            el.classList.add('opacity-0');
                            el.classList.remove('scale-100');
                            el.classList.add(i === ((idx+1)%heroBgs.length) ? 'scale-105' : 'scale-110');
                        }
                    }
                });
            }
            showHeroBg(current);
            setInterval(() => {
                current = (current + 1) % heroBgs.length;
                showHeroBg(current);
            }, 4000);
        })();

        // Carrossel Moderno
        function setupCarousel() {
            const carouselTrack = document.querySelector('.carousel-track');
            const slides = document.querySelectorAll('.carousel-slide');
            const prevBtn = document.querySelector('.carousel-btn.prev');
            const nextBtn = document.querySelector('.carousel-btn.next');
            const indicatorsContainer = document.querySelector('.carousel-indicators');
            let currentSlide = 0;
            const totalSlides = slides.length;
            let autoPlayInterval;

            // Gerar indicadores dinamicamente
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const btn = document.createElement('button');
                btn.className = 'indicator w-3 h-3 bg-white/50 hover:bg-white rounded-full transition-all duration-300';
                btn.setAttribute('aria-label', `Ir para slide ${i + 1}`);
                btn.addEventListener('click', () => {
                    currentSlide = i;
                    updateCarousel();
                });
                indicatorsContainer.appendChild(btn);
            }
            const indicators = indicatorsContainer.querySelectorAll('.indicator');

            function updateCarousel() {
                const offset = -currentSlide * 100;
                carouselTrack.style.transform = `translateX(${offset}%)`;
                slides.forEach((slide, idx) => {
                    slide.classList.toggle('opacity-100', idx === currentSlide);
                    slide.classList.toggle('opacity-0', idx !== currentSlide);
                    slide.classList.toggle('transition-opacity', true);
                    slide.classList.toggle('duration-700', true);
                });
                indicators.forEach((indicator, idx) => {
                    indicator.classList.toggle('active', idx === currentSlide);
                    indicator.classList.toggle('bg-white', idx === currentSlide);
                    indicator.classList.toggle('bg-white/50', idx !== currentSlide);
                });
                // Atualizar background das seções Quem Somos, Diferenciais, Trabalhe Conosco e Servicos2
                const bgImage = slides[currentSlide].querySelector('img')?.getAttribute('src');
                const bgQuemSomos = document.getElementById('carousel-background');
                const bgDiferenciais = document.getElementById('carousel-background-diferenciais');
                const bgTrabalhe = document.getElementById('carousel-background-trabalhe');
                const bgServicos2 = document.getElementById('carousel-background-servicos2');
                if (bgImage) {
                    if (bgQuemSomos) {
                        bgQuemSomos.style.backgroundImage = `url('${bgImage}')`;
                    }
                    if (bgDiferenciais) {
                        bgDiferenciais.style.backgroundImage = `url('${bgImage}')`;
                    }
                    if (bgTrabalhe) {
                        bgTrabalhe.style.backgroundImage = `url('${bgImage}')`;
                    }
                    if (bgServicos2) {
                        // Efeito de transição suave
                        bgServicos2.style.transition = 'opacity 1s';
                        bgServicos2.style.opacity = '0';
                        setTimeout(() => {
                            bgServicos2.style.backgroundImage = `url('${bgImage}')`;
                            bgServicos2.style.backgroundSize = 'cover';
                            bgServicos2.style.backgroundPosition = 'center';
                            bgServicos2.style.backgroundRepeat = 'no-repeat';
                            bgServicos2.style.opacity = '1';
                        }, 400);
                    }
                }
            }
            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel();
            }
            function prevSlide() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateCarousel();
            }
            if (nextBtn) nextBtn.onclick = nextSlide;
            if (prevBtn) prevBtn.onclick = prevSlide;
            // Auto-play
            function startAutoPlay() {
                autoPlayInterval = setInterval(nextSlide, 4000);
            }
            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }
            const carouselContainer = document.querySelector('.carousel-container');
            if (carouselContainer) {
                carouselContainer.addEventListener('mouseenter', stopAutoPlay);
                carouselContainer.addEventListener('mouseleave', startAutoPlay);
            }
            // Navegação por teclado
            document.addEventListener('keydown', (e) => {
                if (document.activeElement.closest('.carousel-container')) {
                    if (e.key === 'ArrowLeft') prevSlide();
                    if (e.key === 'ArrowRight') nextSlide();
                }
            });
            // Inicializar
            updateCarousel();
            startAutoPlay();
        }
        document.addEventListener('DOMContentLoaded', setupCarousel);

        // Banner Topo Aleatório com fade + zoom
        (function() {
            const banners = [
                document.getElementById('top-banner-img1'),
                document.getElementById('top-banner-img2'),
                document.getElementById('top-banner-img3')
            ];
            let current = 0;
            function showBanner(idx) {
                banners.forEach((el, i) => {
                    if (i === idx) {
                        el.classList.remove('opacity-0');
                        el.classList.add('opacity-100');
                        el.classList.remove('scale-110', 'scale-105');
                        el.classList.add('scale-100');
                    } else {
                        el.classList.remove('opacity-100');
                        el.classList.add('opacity-0');
                        el.classList.remove('scale-100');
                        el.classList.add(i === ((idx+1)%3) ? 'scale-105' : 'scale-110');
                    }
                });
            }
            showBanner(current);
            setInterval(() => {
                current = (current + 1) % banners.length;
                showBanner(current);
            }, 4000);
        })();

        // Adicionar efeito de hover e troca de fundo para servicos2
        document.addEventListener('DOMContentLoaded', function() {
            const bgServicos2 = document.getElementById('carousel-background-servicos2');
            // Imagens para cada item
            const listaImgs = [
                'img/carrocel/img1.jpeg',
                'img/carrocel/img2.jpeg',
                'img/carrocel/img3.jpeg',
                'img/carrocel/img4.jpeg',
                'img/carrocel/img5.jpeg',
                'img/carrocel/img6.jpeg',
                'img/carrocel/img7.jpeg'
            ];
            // Guardar imagem atual do carrossel para restaurar
            let carrosselBgAtual = '';
            // Função para fade suave
            function fadeBg(img) {
                if (!bgServicos2) return;
                bgServicos2.style.transition = 'opacity 0.7s';
                bgServicos2.style.opacity = '0';
                setTimeout(() => {
                    bgServicos2.style.backgroundImage = `url('${img}')`;
                    bgServicos2.style.backgroundSize = 'cover';
                    bgServicos2.style.backgroundPosition = 'center';
                    bgServicos2.style.backgroundRepeat = 'no-repeat';
                    bgServicos2.style.opacity = '1';
                }, 250);
            }
            // Eventos de hover para cada item da lista de serviços
            for (let i = 1; i <= 7; i++) {
                const li = document.getElementById(`servico-lista-${i}`);
                if (li) {
                    li.addEventListener('mouseenter', function() {
                        fadeBg(listaImgs[i-1]);
                    });
                    li.addEventListener('mouseleave', function() {
                        if (carrosselBgAtual) fadeBg(carrosselBgAtual);
                    });
                }
            }
            // Atualizar carrosselBgAtual sempre que o carrossel muda
            function updateCarrosselBgAtual() {
                const slides = document.querySelectorAll('.carousel-slide');
                const indicators = document.querySelectorAll('.carousel-indicator, .indicator.active');
                let currentSlide = 0;
                indicators.forEach((el, idx) => {
                    if (el.classList.contains('active')) currentSlide = idx;
                });
                const bgImage = slides[currentSlide]?.querySelector('img')?.getAttribute('src');
                if (bgImage) carrosselBgAtual = bgImage;
            }
            // Chamar updateCarrosselBgAtual no início e sempre que o carrossel muda
            updateCarrosselBgAtual();
            setInterval(updateCarrosselBgAtual, 1000); // Atualiza a cada segundo para garantir sincronização

            // Fade-up animado para os cards de serviços 2
            const cards = document.querySelectorAll('#servicos2 .grid > div');
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.classList.remove('opacity-0', 'translate-y-8');
                    card.classList.add('opacity-100', 'translate-y-0');
                }, 200 + i * 180);
            });
        });

        function toggleCardImage(imgId) {
            const img = document.getElementById(imgId);
            if (!img) return;
            if (img.classList.contains('hidden')) {
                img.classList.remove('hidden');
                img.classList.add('block');
            } else {
                img.classList.add('hidden');
                img.classList.remove('block');
            }
        }

        function openModalServico(imgSrc) {
            const modal = document.getElementById('modal-servico');
            const img = document.getElementById('modal-servico-img');
            if (!modal || !img) return;
            img.src = imgSrc;
            img.classList.remove('opacity-0', 'scale-95');
            img.classList.add('opacity-0', 'scale-95'); // reset
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.add('opacity-100');
                img.classList.remove('opacity-0', 'scale-95');
                img.classList.add('opacity-100', 'scale-100');
            }, 20);
            // Fechar ao clicar fora da imagem
            modal.onclick = function(e) {
                if (e.target === modal) closeModalServico();
            };
        }
        function closeModalServico() {
            const modal = document.getElementById('modal-servico');
            const img = document.getElementById('modal-servico-img');
            if (!modal || !img) return;
            modal.classList.remove('opacity-100');
            img.classList.remove('opacity-100', 'scale-100');
            img.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                img.src = '';
            }, 1000);
        }