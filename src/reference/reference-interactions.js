
        // =====================================================
        // SIMULATION STATE
        // =====================================================
        let isRunning = false;
        let simInterval = null;
        let simTime = 0;

        // DOM Elements - Status
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        const progressText = document.getElementById('progressText');
        const simTimeDisplay = document.getElementById('simTime');

        // DOM Elements - Parameters
        const phValue = document.getElementById('phValue');
        const phBar = document.getElementById('phBar');
        const calciumValue = document.getElementById('calciumValue');
        const calciumBar = document.getElementById('calciumBar');
        const bacteriaValue = document.getElementById('bacteriaValue');
        const bacteriaBar = document.getElementById('bacteriaBar');
        const supersatValue = document.getElementById('supersatValue');
        const supersatBar = document.getElementById('supersatBar');
        const crystalValue = document.getElementById('crystalValue');
        const crystalBar = document.getElementById('crystalBar');

        // DOM Elements - Visual
        const stressPoints = document.querySelectorAll('.stress-point');
        const crackLine = document.getElementById('crackLine');
        const crackBranches = document.getElementById('crackBranches');
        const waterContainer = document.getElementById('waterContainer');
        const gasContainer = document.getElementById('gasContainer');
        const ionContainer = document.getElementById('ionContainer');
        const bacteria = document.querySelectorAll('.bacterium');
        const crystalContainer = document.getElementById('crystalContainer');
        const sealOverlay = document.getElementById('sealOverlay');
        const successMark = document.getElementById('successMark');

        // Stage cards
        const stageCards = [
            document.getElementById('stage1'),
            document.getElementById('stage2'),
            document.getElementById('stage3'),
            document.getElementById('stage4'),
            document.getElementById('stage5'),
            document.getElementById('stage6')
        ];

        // =====================================================
        // UTILITY FUNCTIONS
        // =====================================================
        function updateSimTime() {
            const mins = Math.floor(simTime / 60);
            const secs = simTime % 60;
            simTimeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        function updateStatus(text, color, progress) {
            statusText.textContent = text;
            statusDot.className = 'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors';
            
            const colorMap = {
                'neutral': 'bg-neutral-500',
                'red': 'bg-red-500 animate-pulse',
                'orange': 'bg-orange-500 animate-pulse',
                'blue': 'bg-blue-500 animate-pulse',
                'emerald': 'bg-emerald-500 animate-pulse',
                'cyan': 'bg-cyan-500 animate-pulse',
                'purple': 'bg-purple-500 animate-pulse',
                'green': 'bg-green-500 animate-pulse'
            };
            
            statusDot.classList.add(...(colorMap[color] || colorMap['neutral']).split(' '));
            progressText.textContent = `${progress}%`;
        }

        function activateStage(stageNum) {
            stageCards.forEach((card, idx) => {
                card.classList.remove('active', 'completed');
                if (idx < stageNum - 1) {
                    card.classList.add('completed');
                } else if (idx === stageNum - 1) {
                    card.classList.add('active');
                }
            });
        }

        function updateParameters(params) {
            if (params.ph !== undefined) {
                phValue.textContent = params.ph.toFixed(1);
                phBar.style.width = `${((params.ph - 7) / 6) * 100}%`;
            }
            if (params.calcium !== undefined) {
                calciumValue.textContent = `${params.calcium}%`;
                calciumBar.style.width = `${params.calcium}%`;
            }
            if (params.bacteria !== undefined) {
                bacteriaValue.textContent = `${params.bacteria}%`;
                bacteriaBar.style.width = `${params.bacteria}%`;
            }
            if (params.supersat !== undefined) {
                supersatValue.textContent = params.supersat.toFixed(1);
                supersatBar.style.width = `${Math.min(params.supersat * 10, 100)}%`;
            }
            if (params.crystal !== undefined) {
                crystalValue.textContent = `${params.crystal}%`;
                crystalBar.style.width = `${params.crystal}%`;
            }
        }

        // =====================================================
        // SIMULATION STAGES
        // =====================================================
        
        // Stage 1: Stress concentration and microcrack initiation
        function stageStress() {
            updateStatus('Stress Concentration...', 'red', 8);
            activateStage(1);
            
            // Animate stress points (representing Kt - stress concentration factor)
            stressPoints.forEach((point, idx) => {
                setTimeout(() => {
                    point.style.opacity = '1';
                    point.classList.add('stress-active');
                }, idx * 120);
            });
        }

        // Stage 2: Crack formation and propagation
        function stageCrack() {
            updateStatus('Crack Propagating...', 'orange', 20);
            activateStage(2);

            // Hide stress points
            stressPoints.forEach(point => {
                point.classList.remove('stress-active');
                setTimeout(() => point.style.opacity = '0', 300);
            });

            // Show main crack line with propagation animation
            crackLine.style.opacity = '1';
            crackLine.classList.add('crack-propagating');
            
            // Show crack branches (ITZ microcracks)
            setTimeout(() => {
                crackBranches.style.opacity = '1';
                const mainPath = crackBranches.querySelector('.crack-branch');
                mainPath.style.transition = 'stroke-dashoffset 2.5s ease-out';
                mainPath.style.strokeDashoffset = '0';
                
                // Animate branch cracks
                setTimeout(() => {
                    const branches = crackBranches.querySelectorAll('.crack-branch-small');
                    branches.forEach((branch, idx) => {
                        setTimeout(() => {
                            branch.style.transition = 'stroke-dashoffset 0.8s ease-out';
                            branch.style.strokeDashoffset = '0';
                        }, idx * 200);
                    });
                }, 1500);
            }, 800);

            // Widen crack
            setTimeout(() => {
                crackLine.classList.add('crack-widening');
            }, 2500);
        }

        // Stage 3: Water, oxygen, and CO2 exposure
        function stageExposure() {
            updateStatus('H₂O + O₂ + CO₂ Entering...', 'blue', 35);
            activateStage(3);

            // Create water droplets
            for (let i = 0; i < 10; i++) {
                setTimeout(() => createWaterDrop(), i * 350);
            }

            // Create oxygen bubbles after water starts
            setTimeout(() => {
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => createOxygenBubble(), i * 400);
                }
            }, 1200);

            // Create CO2 particles (dissolving into carbonic acid)
            setTimeout(() => {
                for (let i = 0; i < 6; i++) {
                    setTimeout(() => createCO2Particle(), i * 500);
                }
            }, 2000);

            // Update parameters - Ca leaching begins
            setTimeout(() => {
                updateParameters({ ph: 7.5, calcium: 20, supersat: 1.5 });
            }, 2000);

            setTimeout(() => {
                updateParameters({ calcium: 35, supersat: 2.5 });
            }, 3500);
        }

        function createWaterDrop() {
            const drop = document.createElement('div');
            const leftPos = 8 + Math.random() * 84;
            drop.className = 'absolute water-dropping';
            drop.innerHTML = '💧';
            drop.style.cssText = `
                left: ${leftPos}%;
                top: 35%;
                font-size: 8px;
                animation-delay: ${Math.random() * 0.8}s;
            `;
            waterContainer.appendChild(drop);
            setTimeout(() => drop.remove(), 2500);
        }

        function createOxygenBubble() {
            const bubble = document.createElement('div');
            const leftPos = 12 + Math.random() * 76;
            const size = 4 + Math.random() * 4;
            bubble.className = 'absolute oxygen-floating';
            bubble.style.cssText = `
                left: ${leftPos}%;
                top: 55%;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(147, 197, 253, 0.7));
                border-radius: 50%;
                animation-delay: ${Math.random() * 1.2}s;
            `;
            gasContainer.appendChild(bubble);
            setTimeout(() => bubble.remove(), 3500);
        }

        function createCO2Particle() {
            const particle = document.createElement('div');
            const leftPos = 15 + Math.random() * 70;
            particle.className = 'absolute co2-dissolving font-mono text-[6px] sm:text-[8px] text-blue-300/70';
            particle.textContent = 'CO₂';
            particle.style.cssText = `
                left: ${leftPos}%;
                top: 30%;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            gasContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 3000);
        }

        // Stage 4: Bacteria activation
        function stageBacteriaActivation() {
            updateStatus('Bacteria Activating...', 'emerald', 50);
            activateStage(4);

            // Activate each bacterium with stagger
            bacteria.forEach((bact, idx) => {
                setTimeout(() => {
                    bact.classList.remove('bacteria-dormant');
                    bact.classList.add('bacteria-activating');
                    
                    // After activation animation, start wiggle
                    setTimeout(() => {
                        bact.classList.remove('bacteria-activating');
                        bact.classList.add('bacteria-active');
                    }, 1500);
                }, idx * 250);
            });

            // pH rises due to bacterial urease activity
            setTimeout(() => {
                updateParameters({ ph: 8.5, bacteria: 50, supersat: 4.0 });
            }, 1500);

            setTimeout(() => {
                updateParameters({ ph: 9.2, bacteria: 85, calcium: 55, supersat: 6.5 });
            }, 3000);
        }

        // Stage 5: Crystal nucleation and growth
        function stageCrystalGrowth() {
            updateStatus('CaCO₃ Nucleating...', 'cyan', 70);
            activateStage(5);

            // Create Ca²⁺ ions moving toward nucleation sites
            for (let i = 0; i < 12; i++) {
                setTimeout(() => createCalciumIon(), i * 200);
            }

            // Crystal positions along crack
            const crystalPositions = [6, 18, 32, 48, 62, 76, 90];
            
            // Nucleation phase
            setTimeout(() => {
                updateStatus('Crystals Growing...', 'cyan', 80);
                crystalPositions.forEach((pos, idx) => {
                    setTimeout(() => createCrystal(pos), idx * 350);
                });
            }, 2000);

            // Update parameters during crystal growth
            setTimeout(() => {
                updateParameters({ crystal: 40, supersat: 8.0, calcium: 75 });
            }, 2500);

            setTimeout(() => {
                updateParameters({ crystal: 80, supersat: 9.5, calcium: 92 });
            }, 4500);
        }

        function createCalciumIon() {
            const ion = document.createElement('div');
            const startLeft = Math.random() * 100;
            const targetLeft = 20 + Math.random() * 60;
            ion.className = 'absolute font-mono text-[5px] sm:text-[7px] text-cyan-400 ion-moving';
            ion.textContent = 'Ca²⁺';
            ion.style.cssText = `
                left: ${startLeft}%;
                top: ${20 + Math.random() * 20}%;
                --tx: ${(targetLeft - startLeft) * 0.8}%;
                --ty: ${25 + Math.random() * 15}%;
            `;
            ionContainer.appendChild(ion);
            setTimeout(() => ion.remove(), 2000);
        }

        function createCrystal(leftPercent) {
            const crystal = document.createElement('div');
            const size = 5 + Math.random() * 5;
            crystal.className = 'absolute crystal-nucleating';
            crystal.style.cssText = `
                left: ${leftPercent}%;
                top: 50%;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(135deg, rgba(34, 211, 238, 0.9), rgba(6, 182, 212, 0.7));
                border: 1px solid rgba(34, 211, 238, 0.8);
                transform: translateY(-50%) rotate(45deg) scale(0);
            `;
            crystalContainer.appendChild(crystal);

            // Transition to growth phase
            setTimeout(() => {
                crystal.classList.remove('crystal-nucleating');
                crystal.classList.add('crystal-growing');
            }, 1200);
        }

        // Stage 6: Crack sealing
        function stageSeal() {
            updateStatus('Sealing Crack...', 'green', 92);
            activateStage(6);

            // Bacteria return to dormant state
            bacteria.forEach(bact => {
                bact.classList.remove('bacteria-active');
                bact.style.transition = 'opacity 1.5s';
                bact.style.opacity = '0.25';
            });

            // Show seal overlay with glow
            sealOverlay.style.opacity = '1';
            sealOverlay.classList.add('seal-glowing');

            // Hide crack with sealing animation
            setTimeout(() => {
                crackLine.classList.add('crack-sealing');
                crackBranches.style.transition = 'opacity 2.5s';
                crackBranches.style.opacity = '0';
            }, 800);

            // Fade crystals as they merge into seal
            setTimeout(() => {
                const crystals = crystalContainer.querySelectorAll('div');
                crystals.forEach((crystal, idx) => {
                    setTimeout(() => {
                        crystal.style.transition = 'opacity 0.6s, transform 0.6s';
                        crystal.style.opacity = '0';
                    }, idx * 80);
                });
            }, 2000);

            // Final success state
            setTimeout(() => {
                sealOverlay.style.transition = 'opacity 1.5s';
                sealOverlay.style.opacity = '0';
                
                successMark.style.opacity = '1';
                successMark.style.transform = 'translate(-50%, -50%) scale(1)';
                successMark.classList.add('success-bounce');

                updateStatus('Crack Healed! ✓', 'green', 100);
                updateParameters({ ph: 9.0, crystal: 100, bacteria: 20, supersat: 1.0 });
            }, 4000);
        }

        // =====================================================
        // MAIN SIMULATION CONTROLLER
        // =====================================================
        function startSimulation() {
            if (isRunning) return;
            
            isRunning = true;
            simTime = 0;
            
            // Disable start button
            document.getElementById('startBtn').style.pointerEvents = 'none';
            document.getElementById('startBtn').style.opacity = '0.5';

            // Start timer
            simInterval = setInterval(() => {
                simTime++;
                updateSimTime();
            }, 1000);

            // Stage timings (in ms)
            const timings = {
                stress: 0,
                crack: 3000,
                exposure: 7000,
                bacteria: 12000,
                crystal: 17000,
                seal: 23000,
                end: 29000
            };

            // Execute stages
            setTimeout(() => stageStress(), timings.stress);
            setTimeout(() => stageCrack(), timings.crack);
            setTimeout(() => stageExposure(), timings.exposure);
            setTimeout(() => stageBacteriaActivation(), timings.bacteria);
            setTimeout(() => stageCrystalGrowth(), timings.crystal);
            setTimeout(() => stageSeal(), timings.seal);

            // End simulation
            setTimeout(() => {
                clearInterval(simInterval);
                isRunning = false;
                document.getElementById('startBtn').style.pointerEvents = 'auto';
                document.getElementById('startBtn').style.opacity = '1';
            }, timings.end);
        }

        function resetSimulation() {
            // Stop timer
            clearInterval(simInterval);
            isRunning = false;
            simTime = 0;
            
            updateSimTime();
            updateStatus('Ready to Start', 'neutral', 0);
            
            // Re-enable start button
            document.getElementById('startBtn').style.pointerEvents = 'auto';
            document.getElementById('startBtn').style.opacity = '1';

            // Reset parameters
            updateParameters({ ph: 7.0, calcium: 0, bacteria: 0, supersat: 1.0, crystal: 0 });

            // Reset stage cards
            stageCards.forEach(card => card.classList.remove('active', 'completed'));

            // Reset stress points
            stressPoints.forEach(point => {
                point.style.opacity = '0';
                point.classList.remove('stress-active');
            });

            // Reset crack
            crackLine.style.opacity = '0';
            crackLine.className = 'absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 opacity-0';
            crackLine.style.clipPath = 'inset(0 100% 0 0)';

            // Reset crack branches
            crackBranches.style.opacity = '0';
            crackBranches.querySelectorAll('path').forEach(path => {
                path.style.strokeDashoffset = path.getAttribute('stroke-dasharray') || '400';
            });

            // Clear containers
            waterContainer.innerHTML = '';
            gasContainer.innerHTML = '';
            ionContainer.innerHTML = '';
            crystalContainer.innerHTML = '';

            // Reset bacteria
            bacteria.forEach(bact => {
                bact.classList.remove('bacteria-activating', 'bacteria-active');
                bact.classList.add('bacteria-dormant');
                bact.style.opacity = '';
            });

            // Reset seal overlay
            sealOverlay.style.opacity = '0';
            sealOverlay.classList.remove('seal-glowing');

            // Reset success mark
            successMark.style.opacity = '0';
            successMark.style.transform = 'translate(-50%, -50%) scale(0)';
            successMark.classList.remove('success-bounce');
        }

        // =====================================================
        // SCROLL ANIMATIONS
        // =====================================================
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });

        // =====================================================
        // INTERACTIVE SLIDESHOW EXPLAINER
        // =====================================================
        
        const slides = [
            {
                label: "INTRODUCTION",
                title: "Welcome to MICP Technology",
                subtitle: "Self-healing concrete overview",
                narration: "Welcome to this interactive guide on Microbiologically Induced Calcium Carbonate Precipitation, or MICP, in self-healing concrete. This revolutionary technology allows concrete structures to autonomously repair cracks using bacteria and biochemical reactions. Let's explore each stage of this fascinating process.",
                notes: `
                    <p class="mb-2"><strong class="text-emerald-400">MICP</strong> stands for Microbiologically Induced Calcium Carbonate Precipitation — a bio-based self-healing technology.</p>
                    <p class="mb-2">Bacteria like <em>Bacillus</em> and <em>Lactococcus</em> are incorporated into the concrete mix, remaining dormant until cracks form.</p>
                    <p>When activated by moisture and oxygen, they produce <strong class="text-cyan-400">CaCO₃ (calcite)</strong> crystals that seal cracks autonomously.</p>
                `,
                terms: [
                    { text: "MICP", color: "emerald" },
                    { text: "CaCO₃", color: "cyan" },
                    { text: "Bacillus", color: "blue" },
                    { text: "Calcite", color: "purple" }
                ],
                visual: `
                    <div class="text-center">
                        <div class="relative inline-block">
                            <div class="w-32 h-32 sm:w-48 sm:h-48 mx-auto relative">
                                <div class="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-spin-slow"></div>
                                <div class="absolute inset-3 sm:inset-4 rounded-full border-2 border-cyan-500/30 animate-spin-slow" style="animation-direction: reverse;"></div>
                                <div class="absolute inset-6 sm:inset-8 rounded-full border-2 border-emerald-500/20 animate-spin-slow"></div>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center">
                                        <span class="text-2xl sm:text-4xl">🦠</span>
                                    </div>
                                </div>
                                <div class="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 rounded bg-cyan-500/40 rotate-45 animate-pulse"></div>
                                <div class="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 sm:w-5 sm:h-5 rounded bg-emerald-500/40 rotate-45 animate-pulse" style="animation-delay: 0.5s;"></div>
                            </div>
                        </div>
                        <div class="mt-4 sm:mt-6 text-sm sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Self-Healing Concrete</div>
                    </div>
                `,
                caption: "MICP: Biology meets Civil Engineering"
            },
            {
                label: "STAGE 1",
                title: "Stress Concentration",
                subtitle: "Load causes internal stress buildup (Kt)",
                narration: "When load is applied to concrete, internal stress builds up. The stress concentration factor, known as K-t, describes how stress amplifies at weak points like pores, voids, and the interfacial transition zone between aggregates and cement paste.",
                notes: `
                    <p class="mb-2"><strong class="text-red-400">Stress Concentration Factor (Kt)</strong> = σmax / σengineered</p>
                    <p class="mb-2">Stress amplifies at weak points in the matrix.</p>
                `,
                terms: [
                    { text: "Kt", color: "red" },
                    { text: "σmax", color: "orange" },
                    { text: "ITZ", color: "amber" }
                ],
                visual: `
                    <div class="relative">
                        <div class="w-48 sm:w-64 h-28 sm:h-40 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg border-2 border-gray-500 relative overflow-hidden">
                            <div class="absolute top-1/2 left-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"></div>
                            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-ping" style="animation-delay: 0.3s;"></div>
                            <div class="absolute top-1/2 right-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping" style="animation-delay: 0.5s;"></div>
                        </div>
                        <div class="mt-4 sm:mt-6 text-center">
                            <div class="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                                <span class="font-mono text-xs sm:text-sm text-red-400">Kt = σ<sub>max</sub> / σ<sub>eng</sub></span>
                            </div>
                        </div>
                    </div>
                `,
                caption: "Stress concentrates at weak points"
            },
            {
                label: "STAGE 2",
                title: "Crack Formation",
                subtitle: "Microcrack initiation at ITZ",
                narration: "Once local tensile stress exceeds concrete's tensile strength, microcracks initiate at the interfacial transition zone and propagate through the matrix.",
                notes: `<p class="mb-2"><strong class="text-orange-400">Crack Propagation</strong> occurs in stages from initiation to growth.</p>`,
                terms: [
                    { text: "ITZ", color: "orange" },
                    { text: "KI < KIC", color: "amber" }
                ],
                visual: `
                    <div class="relative">
                        <div class="w-48 sm:w-64 h-28 sm:h-40 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg border-2 border-gray-500 relative overflow-hidden">
                            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 256 160">
                                <path d="M 0,80 Q 64,75 128,82 T 256,78" stroke="#f97316" stroke-width="3" fill="none" stroke-dasharray="300" stroke-dashoffset="0"></path>
                            </svg>
                        </div>
                        <div class="mt-4 sm:mt-6 flex justify-center gap-2">
                            <div class="px-2 py-1 rounded text-[9px] sm:text-[10px] bg-orange-500/20 text-orange-400">Propagating</div>
                        </div>
                    </div>
                `,
                caption: "Crack propagates through matrix"
            },
            {
                label: "STAGE 3",
                title: "Water & Oxygen Exposure",
                subtitle: "Moisture penetration & CO₂ dissolution",
                narration: "Cracks create pathways for moisture, oxygen, and carbon dioxide to penetrate, creating the chemical environment for precipitation.",
                notes: `<p class="mb-2"><strong class="text-blue-400">CO₂ Dissolution:</strong> CO₂ + H₂O → H₂CO₃ → CO₃²⁻</p>`,
                terms: [
                    { text: "H₂O", color: "blue" },
                    { text: "O₂", color: "cyan" },
                    { text: "CO₂", color: "sky" }
                ],
                visual: `
                    <div class="relative">
                        <div class="w-48 sm:w-64 h-28 sm:h-40 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg border-2 border-gray-500 relative overflow-hidden">
                            <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2"></div>
                            <div class="absolute top-2 left-1/4 text-base sm:text-lg animate-bounce">💧</div>
                            <div class="absolute top-4 left-1/2 text-base sm:text-lg animate-bounce" style="animation-delay: 0.3s;">💧</div>
                            <div class="absolute top-2 right-1/4 text-base sm:text-lg animate-bounce" style="animation-delay: 0.6s;">💧</div>
                        </div>
                        <div class="mt-4 sm:mt-6 text-center">
                            <div class="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                <span class="font-mono text-[10px] sm:text-xs text-blue-400">CO₂ + H₂O → CO₃²⁻</span>
                            </div>
                        </div>
                    </div>
                `,
                caption: "Water, O₂, and CO₂ enter the crack"
            },
            {
                label: "STAGE 4",
                title: "Bacterial Activation",
                subtitle: "Bacillus bacteria awaken",
                narration: "Dormant bacteria activate upon contact with moisture and oxygen, producing urease enzyme that raises local pH.",
                notes: `<p class="mb-2"><strong class="text-emerald-400">Urease Activity</strong> raises pH to 8.5 - 9.5</p>`,
                terms: [
                    { text: "Bacillus", color: "emerald" },
                    { text: "Urease", color: "green" }
                ],
                visual: `
                    <div class="relative">
                        <div class="w-48 sm:w-64 h-28 sm:h-40 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg border-2 border-gray-500 relative overflow-hidden">
                            <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2"></div>
                            <div class="absolute top-[45%] left-[20%] w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                            <div class="absolute top-[50%] left-[50%] w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse shadow-lg shadow-emerald-500/50" style="animation-delay: 0.3s;"></div>
                            <div class="absolute top-[47%] left-[80%] w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse shadow-lg shadow-emerald-500/50" style="animation-delay: 0.6s;"></div>
                            <div class="absolute bottom-2 right-2 px-2 py-1 rounded bg-emerald-500/20 text-[9px] sm:text-[10px] font-mono text-emerald-400">pH 9.0 ↑</div>
                        </div>
                    </div>
                `,
                caption: "Bacteria activate and produce urease"
            },
            {
                label: "STAGE 5",
                title: "Crystal Nucleation",
                subtitle: "CaCO₃ heterogeneous nucleation",
                narration: "When supersaturation exceeds the threshold, calcium carbonate begins to nucleate on crack surfaces.",
                notes: `<p class="mb-2"><strong class="text-cyan-400">S = IAP / Ksp</strong> - When S > 1, precipitation occurs.</p>`,
                terms: [
                    { text: "S = IAP/Ksp", color: "cyan" },
                    { text: "Nucleation", color: "sky" }
                ],
                visual: `
                    <div class="relative">
                        <div class="w-48 sm:w-64 h-28 sm:h-40 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg border-2 border-gray-500 relative overflow-hidden">
                            <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800/50 -translate-y-1/2"></div>
                            <div class="absolute top-[48%] left-[15%] w-3 h-3 sm:w-4 sm:h-4 bg-cyan-400/80 rotate-45 animate-pulse shadow-lg shadow-cyan-500/50"></div>
                            <div class="absolute top-[50%] left-[40%] w-4 h-4 sm:w-5 sm:h-5 bg-cyan-400/80 rotate-45 animate-pulse shadow-lg shadow-cyan-500/50" style="animation-delay: 0.3s;"></div>
                            <div class="absolute top-[48%] left-[65%] w-3 h-3 sm:w-4 sm:h-4 bg-cyan-400/80 rotate-45 animate-pulse shadow-lg shadow-cyan-500/50" style="animation-delay: 0.6s;"></div>
                            <div class="absolute top-2 right-2 px-2 py-1 rounded bg-cyan-500/20 text-[9px] sm:text-[10px] font-mono text-cyan-400">S > 5</div>
                        </div>
                        <div class="mt-4 sm:mt-6 text-center">
                            <div class="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                                <span class="font-mono text-xs sm:text-sm text-cyan-400">Ca²⁺ + CO₃²⁻ → CaCO₃↓</span>
                            </div>
                        </div>
                    </div>
                `,
                caption: "CaCO₃ crystals nucleate and grow"
            },
            {
                label: "STAGE 6",
                title: "Crack Sealed",
                subtitle: "Crystal growth fills crack",
                narration: "As crystals grow, they fill the crack and restore structural integrity. The healing is most effective for cracks under 0.3mm.",
                notes: `<p class="mb-2"><strong class="text-green-400">Effective Healing:</strong> Cracks < 0.3 mm width</p>`,
                terms: [
                    { text: "< 0.3mm", color: "green" },
                    { text: "Sealed", color: "emerald" }
                ],
                visual: `
                    <div class="relative">
                        <div class="w-48 sm:w-64 h-28 sm:h-40 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg border-2 border-gray-500 relative overflow-hidden">
                            <div class="absolute top-1/2 left-0 w-full h-1 sm:h-1.5 -translate-y-1/2">
                                <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 rounded-full"></div>
                                <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 rounded-full blur-md animate-pulse"></div>
                            </div>
                            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center animate-bounce" style="animation-duration: 2s;">
                                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-4 sm:mt-6 text-center">
                            <div class="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                                <span class="text-sm sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Crack Healed! ✓</span>
                            </div>
                        </div>
                    </div>
                `,
                caption: "Structural integrity restored"
            }
        ];

        let currentSlide = 0;
        let isNarrating = false;
        let isAutoPlay = false;
        let speechRate = 1;
        let speechUtterance = null;
        let selectedVoice = null;
        let availableVoices = [];

        const voiceQualityKeywords = {
            'neural': 100, 'natural': 100, 'wavenet': 95, 'premium': 90,
            'google us english': 80, 'google uk english': 80, 'microsoft': 75,
            'samantha': 75, 'karen': 75, 'daniel': 75, 'aria': 80, 'jenny': 80,
            'google': 60, 'espeak': 10
        };

        function scoreVoice(voice) {
            const nameLower = voice.name.toLowerCase();
            let score = 40;
            for (const [keyword, points] of Object.entries(voiceQualityKeywords)) {
                if (nameLower.includes(keyword)) score = Math.max(score, points);
            }
            if (voice.lang.startsWith('en')) score += 10;
            if (!voice.localService) score += 5;
            return score;
        }

        function populateVoiceSelector() {
            const voiceSelect = document.getElementById('voiceSelect');
            availableVoices = speechSynthesis.getVoices();
            if (availableVoices.length === 0) return;
            
            const englishVoices = availableVoices
                .filter(v => v.lang.startsWith('en'))
                .map(v => ({ voice: v, score: scoreVoice(v) }))
                .sort((a, b) => b.score - a.score);
            
            voiceSelect.innerHTML = '';
            
            if (englishVoices.length > 0) {
                const optGroup = document.createElement('optgroup');
                optGroup.label = '⭐ Recommended';
                englishVoices.forEach(({ voice, score }, index) => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    let quality = score >= 90 ? '🌟 ' : score >= 70 ? '✨ ' : '';
                    option.textContent = `${quality}${voice.name}`;
                    if (index === 0) { option.selected = true; selectedVoice = voice; }
                    optGroup.appendChild(option);
                });
                voiceSelect.appendChild(optGroup);
            }
        }

        function updateSelectedVoice() {
            const selectedName = document.getElementById('voiceSelect').value;
            selectedVoice = availableVoices.find(v => v.name === selectedName) || null;
        }

        function testVoice() {
            if (!('speechSynthesis' in window)) return alert('TTS not supported');
            window.speechSynthesis.cancel();
            const testUtterance = new SpeechSynthesisUtterance("Hello! Testing the voice.");
            testUtterance.rate = speechRate;
            if (selectedVoice) testUtterance.voice = selectedVoice;
            window.speechSynthesis.speak(testUtterance);
        }

        function initSlideshow() {
            updateSlide(0);
            if ('speechSynthesis' in window) {
                populateVoiceSelector();
                speechSynthesis.onvoiceschanged = populateVoiceSelector;
            }
        }

        function updateSlide(index) {
            currentSlide = index;
            const slide = slides[index];
            document.getElementById('slideLabel').textContent = slide.label;
            document.getElementById('slideTitle').textContent = slide.title;
            document.getElementById('slideSubtitle').textContent = slide.subtitle;
            document.getElementById('slideNarration').textContent = slide.narration;
            document.getElementById('slideNotes').innerHTML = slide.notes;
            document.getElementById('slideVisual').innerHTML = slide.visual;
            document.getElementById('visualCaption').textContent = slide.caption;
            
            const termsHtml = slide.terms.map(term => 
                `<span class="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-${term.color}-500/10 text-${term.color}-400 text-[9px] sm:text-[10px] font-mono">${term.text}</span>`
            ).join('');
            document.getElementById('slideTerms').innerHTML = termsHtml;
            
            document.getElementById('slideProgress').style.width = `${((index + 1) / slides.length) * 100}%`;
            document.getElementById('slideStatus').textContent = `${index + 1} / ${slides.length}`;
            
            document.querySelectorAll('.slide-tab').forEach((tab, i) => {
                tab.classList.remove('active', 'bg-white/10', 'text-white');
                tab.classList.add('text-neutral-500');
                if (i === index) {
                    tab.classList.add('active', 'bg-white/10', 'text-white');
                    tab.classList.remove('text-neutral-500');
                }
            });
            
            document.getElementById('prevBtn').disabled = index === 0;
            document.getElementById('nextBtn').disabled = index === slides.length - 1;
            document.getElementById('slideNotesDetails').removeAttribute('open');
        }

        function goToSlide(index) { if (isNarrating) stopNarration(); updateSlide(index); }
        function nextSlide() { if (currentSlide < slides.length - 1) { goToSlide(currentSlide + 1); if (isAutoPlay && isNarrating) setTimeout(speakCurrentSlide, 300); } else if (isAutoPlay) { stopNarration(); isAutoPlay = false; document.getElementById('autoPlayCheck').checked = false; } }
        function prevSlide() { if (currentSlide > 0) goToSlide(currentSlide - 1); }
        function updateSpeechRate() { speechRate = parseFloat(document.getElementById('speechRate').value); }

        function speakCurrentSlide() {
            if (!('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            speechUtterance = new SpeechSynthesisUtterance(slides[currentSlide].narration);
            speechUtterance.rate = speechRate;
            if (selectedVoice) speechUtterance.voice = selectedVoice;
            speechUtterance.onend = () => { if (isAutoPlay && currentSlide < slides.length - 1) setTimeout(nextSlide, 800); else if (currentSlide === slides.length - 1) stopNarration(); };
            speechUtterance.onerror = stopNarration;
            window.speechSynthesis.speak(speechUtterance);
        }

        function toggleNarration() { isNarrating ? stopNarration() : startNarration(); }
        function startNarration() { isNarrating = true; updateNarrateButton(); speakCurrentSlide(); }
        function stopNarration() { window.speechSynthesis.cancel(); isNarrating = false; updateNarrateButton(); }

        function updateNarrateButton() {
            document.getElementById('narratePlayIcon').classList.toggle('hidden', isNarrating);
            document.getElementById('narrateStopIcon').classList.toggle('hidden', !isNarrating);
            document.getElementById('narrateBtnText').textContent = isNarrating ? 'Stop' : 'Narrate';
        }

        function toggleAutoPlay() { isAutoPlay = document.getElementById('autoPlayCheck').checked; if (isAutoPlay && !isNarrating) startNarration(); }

        document.addEventListener('DOMContentLoaded', initSlideshow);
        if (document.readyState !== 'loading') initSlideshow();
        setTimeout(() => { if ('speechSynthesis' in window) populateVoiceSelector(); }, 100);
    