'use strict';

module.exports = {
	getNouns: getNouns,
	getVerbs: getVerbs
};

function getNouns() {
	return [
		{
			orcish: 'ork',
			english: 'orc',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'masculine',
				nominative: {
					singular: 'ork',
					plural: 'orkulz'
				},
				genitive: {
					singular: 'orku',
					plural: 'orkurru'
				},
				dative: {
					singular: 'orko',
					plural: 'orkors'
				},
				accusative: {
					singular: 'orkudz',
					plural: 'orkuluz'
				},
				vocative: {
					singular: 'orko',
					plural: 'orkors'
				}
			}
		},
		{
			orcish: 'arkad',
			english: 'magic',
			PoS: 'noun',
			noun: {
				declension: 'first',
				gender: 'feminine',
				nominative: {
					singular: 'arkad',
					plural: 'arkadz'
				},
				genitive: {
					singular: 'arkar',
					plural: 'arkarru'
				},
				dative: {
					singular: 'arkae',
					plural: 'arkaes'
				},
				accusative: {
					singular: 'arkaz',
					plural: 'arkaruz'
				},
				vocative: {
					singular: 'arkae',
					plural: 'arkaes'
				}
			}
		},
		{
			orcish: 'skuad',
			english: 'sun',
			PoS: 'noun',
			noun: {
				declension: 'first',
				gender: 'feminine',
				nominative: {
					singular: 'skuad',
					plural: 'skuadz'
				},
				genitive: {
					singular: 'skuar',
					plural: 'skuarru'
				},
				dative: {
					singular: 'skuae',
					plural: 'skuaes'
				},
				accusative: {
					singular: 'skuaz',
					plural: 'skuaruz'
				},
				vocative: {
					singular: 'skuae',
					plural: 'skuaes'
				}
			}
		},
		{
			orcish: 'sagam',
			english: 'universe',
			PoS: 'noun',
			noun: {
				declension: 'first',
				gender: 'feminine',
				nominative: {
					singular: 'sagam',
					plural: 'sagadz'
				},
				genitive: {
					singular: 'sagar',
					plural: 'sagarru'
				},
				dative: {
					singular: 'sagae',
					plural: 'sagaes'
				},
				accusative: {
					singular: 'sagadz',
					plural: 'sagaruz'
				},
				vocative: {
					singular: 'sagae',
					plural: 'sagaes'
				}
			}
		},
		{
			orcish: 'marsiam',
			english: 'heresy',
			PoS: 'noun',
			noun: {
				declension: 'first',
				gender: 'feminine',
				nominative: {
					singular: 'marsiam',
					plural: 'marsiadz'
				},
				genitive: {
					singular: 'marsiar',
					plural: 'marsiarru'
				},
				dative: {
					singular: 'marsiae',
					plural: 'marsiaes'
				},
				accusative: {
					singular: 'marsiadz',
					plural: 'marsiaruz'
				},
				vocative: {
					singular: 'marsiae',
					plural: 'marsiaes'
				}
			}
		},
		{
			orcish: 'paizag',
			english: 'sculptor',
			PoS: 'noun',
			noun: {
				declension: 'first',
				gender: 'feminine',
				nominative: {
					singular: 'paizag',
					plural: 'paizadz'
				},
				genitive: {
					singular: 'paizar',
					plural: 'paizarru'
				},
				dative: {
					singular: 'paizae',
					plural: 'paizaes'
				},
				accusative: {
					singular: 'paizaz',
					plural: 'paizaruz'
				},
				vocative: {
					singular: 'paizae',
					plural: 'paizaes'
				}
			}
		},
		{
			orcish: 'taeag',
			english: 'crow',
			PoS: 'noun',
			noun: {
				declension: 'first',
				gender: 'feminine',
				nominative: {
					singular: 'taeag',
					plural: 'taeadz'
				},
				genitive: {
					singular: 'taear',
					plural: 'taearru'
				},
				dative: {
					singular: 'taeae',
					plural: 'taeaes'
				},
				accusative: {
					singular: 'taeaz',
					plural: 'taearuz'
				},
				vocative: {
					singular: 'taeae',
					plural: 'taeaes'
				}
			}
		},
		{
			orcish: 'gudul',
			english: 'number',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'masculine',
				nominative: {
					singular: 'gudul',
					plural: 'gudulz'
				},
				genitive: {
					singular: 'gudu',
					plural: 'gudurru'
				},
				dative: {
					singular: 'gudo',
					plural: 'gudors'
				},
				accusative: {
					singular: 'gududz',
					plural: 'guduluz'
				},
				vocative: {
					singular: 'gudo',
					plural: 'gudors'
				}
			}
		},
		{
			orcish: 'kaiul',
			english: 'ally',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'masculine',
				nominative: {
					singular: 'kaiul',
					plural: 'kaiulz'
				},
				genitive: {
					singular: 'kaiu',
					plural: 'kaiurru'
				},
				dative: {
					singular: 'kaio',
					plural: 'kaiors'
				},
				accusative: {
					singular: 'kaiudz',
					plural: 'kaiuluz'
				},
				vocative: {
					singular: 'kaio',
					plural: 'kaiors'
				}
			}
		},
		{
			orcish: 'ankor',
			english: 'holiday',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'masculine',
				nominative: {
					singular: 'ankor',
					plural: 'ankulz'
				},
				genitive: {
					singular: 'anku',
					plural: 'ankurru'
				},
				dative: {
					singular: 'anko',
					plural: 'ankors'
				},
				accusative: {
					singular: 'ankudz',
					plural: 'ankuluz'
				},
				vocative: {
					singular: 'anko',
					plural: 'ankors'
				}
			}
		},
		{
			orcish: 'djemaior',
			english: 'lair',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'masculine',
				nominative: {
					singular: 'djemaior',
					plural: 'djemaiulz'
				},
				genitive: {
					singular: 'djemaiu',
					plural: 'djemaiurru'
				},
				dative: {
					singular: 'djemaio',
					plural: 'djemaiors'
				},
				accusative: {
					singular: 'djemaiudz',
					plural: 'djemaiuluz'
				},
				vocative: {
					singular: 'djemaio',
					plural: 'djemaiors'
				}
			}
		},
		{
			orcish: 'aizak',
			english: 'gravity',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'masculine',
				nominative: {
					singular: 'aizak',
					plural: 'aizulz'
				},
				genitive: {
					singular: 'aizu',
					plural: 'aizurru'
				},
				dative: {
					singular: 'aizo',
					plural: 'aizors'
				},
				accusative: {
					singular: 'aizudz',
					plural: 'aizuluz'
				},
				vocative: {
					singular: 'aizo',
					plural: 'aizors'
				}
			}
		},
		{
			orcish: 'mesk',
			english: 'face',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'masculine',
				nominative: {
					singular: 'mesk',
					plural: 'meskulz'
				},
				genitive: {
					singular: 'mesku',
					plural: 'meskurru'
				},
				dative: {
					singular: 'mesko',
					plural: 'meskors'
				},
				accusative: {
					singular: 'meskudz',
					plural: 'meskuluz'
				},
				vocative: {
					singular: 'mesko',
					plural: 'meskors'
				}
			}
		},
		{
			orcish: 'shaidax',
			english: 'problem',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'masculine',
				nominative: {
					singular: 'shaidax',
					plural: 'shaidulz'
				},
				genitive: {
					singular: 'shaidu',
					plural: 'shaidurru'
				},
				dative: {
					singular: 'shaido',
					plural: 'shaidors'
				},
				accusative: {
					singular: 'shaidudz',
					plural: 'shaiduluz'
				},
				vocative: {
					singular: 'shaido',
					plural: 'shaidors'
				}
			}
		},
		{
			orcish: 'lorenx',
			english: 'thunder',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'masculine',
				nominative: {
					singular: 'lorenx',
					plural: 'lorenulz'
				},
				genitive: {
					singular: 'lorenu',
					plural: 'lorenurru'
				},
				dative: {
					singular: 'loreno',
					plural: 'lorenors'
				},
				accusative: {
					singular: 'lorenudz',
					plural: 'lorenuluz'
				},
				vocative: {
					singular: 'loreno',
					plural: 'lorenors'
				}
			}
		},
		{
			orcish: 'natalid',
			english: 'blade',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'neutral',
				nominative: {
					singular: 'natalid',
					plural: 'natalidz'
				},
				genitive: {
					singular: 'natalu',
					plural: 'natalurru'
				},
				dative: {
					singular: 'natalo',
					plural: 'natalaes'
				},
				accusative: {
					singular: 'nataludz',
					plural: 'nataluluz'
				},
				vocative: {
					singular: 'natalo',
					plural: 'natalaes'
				}
			}
		},
		{
			orcish: 'pakchuid',
			english: 'nonsense',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'neutral',
				nominative: {
					singular: 'pakchuid',
					plural: 'pakchuidz'
				},
				genitive: {
					singular: 'pakchuu',
					plural: 'pakchuurru'
				},
				dative: {
					singular: 'pakchuo',
					plural: 'pakchuaes'
				},
				accusative: {
					singular: 'pakchuudz',
					plural: 'pakchuuluz'
				},
				vocative: {
					singular: 'pakchuo',
					plural: 'pakchuaes'
				}
			}
		},
		{
			orcish: 'bennathed',
			english: 'spear',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'neutral',
				nominative: {
					singular: 'bennathed',
					plural: 'bennathidz'
				},
				genitive: {
					singular: 'bennathu',
					plural: 'bennathurru'
				},
				dative: {
					singular: 'bennatho',
					plural: 'bennathaes'
				},
				accusative: {
					singular: 'bennathudz',
					plural: 'bennathuluz'
				},
				vocative: {
					singular: 'bennatho',
					plural: 'bennathaes'
				}
			}
		},
		{
			orcish: 'alankaed',
			english: 'window',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'neutral',
				nominative: {
					singular: 'alankaed',
					plural: 'alankaidz'
				},
				genitive: {
					singular: 'alankau',
					plural: 'alankaurru'
				},
				dative: {
					singular: 'alankao',
					plural: 'alankaaes'
				},
				accusative: {
					singular: 'alankaudz',
					plural: 'alankauluz'
				},
				vocative: {
					singular: 'alankao',
					plural: 'alankaaes'
				}
			}
		},
		{
			orcish: 'tud',
			english: 'pet',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'neutral',
				nominative: {
					singular: 'tud',
					plural: 'tidz'
				},
				genitive: {
					singular: 'tu',
					plural: 'turru'
				},
				dative: {
					singular: 'to',
					plural: 'taes'
				},
				accusative: {
					singular: 'tudz',
					plural: 'tuluz'
				},
				vocative: {
					singular: 'to',
					plural: 'taes'
				}
			}
		},
		{
			orcish: 'keld',
			english: 'camel',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'neutral',
				nominative: {
					singular: 'keld',
					plural: 'kelidz'
				},
				genitive: {
					singular: 'kelu',
					plural: 'kelurru'
				},
				dative: {
					singular: 'kelo',
					plural: 'kelaes'
				},
				accusative: {
					singular: 'keludz',
					plural: 'keluluz'
				},
				vocative: {
					singular: 'kelo',
					plural: 'kelaes'
				}
			}
		},
		{
			orcish: 'kanukz',
			english: 'hockey',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'neutral',
				nominative: {
					singular: 'kanukz',
					plural: 'kanukidz'
				},
				genitive: {
					singular: 'kanuku',
					plural: 'kanukurru'
				},
				dative: {
					singular: 'kanuko',
					plural: 'kanukaes'
				},
				accusative: {
					singular: 'kanukudz',
					plural: 'kanukuluz'
				},
				vocative: {
					singular: 'kanuko',
					plural: 'kanukaes'
				}
			}
		},
		{
			orcish: 'wurmadj',
			english: 'wyrmbrood',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'neutral',
				nominative: {
					singular: 'wurmadj',
					plural: 'wurmadjidz'
				},
				genitive: {
					singular: 'wurmadju',
					plural: 'wurmadjurru'
				},
				dative: {
					singular: 'wurmadjo',
					plural: 'wurmadjaes'
				},
				accusative: {
					singular: 'wurmadjudz',
					plural: 'wurmadjuluz'
				},
				vocative: {
					singular: 'wurmadjo',
					plural: 'wurmadjaes'
				}
			}
		},
		{
			orcish: 'orgash',
			english: 'coast',
			PoS: 'noun',
			noun: {
				declension: 'third',
				gender: 'feminine',
				nominative: {
					singular: 'orgash',
					plural: 'orgalz'
				},
				genitive: {
					singular: 'orgarn',
					plural: 'orgarnu'
				},
				dative: {
					singular: 'organ',
					plural: 'orgahan'
				},
				accusative: {
					singular: 'orgach',
					plural: 'orgarach'
				},
				vocative: {
					singular: 'organo',
					plural: 'organosh'
				}
			}
		},
		{
			orcish: 'haliash',
			english: 'eagle',
			PoS: 'noun',
			noun: {
				declension: 'third',
				gender: 'feminine',
				nominative: {
					singular: 'haliash',
					plural: 'halialz'
				},
				genitive: {
					singular: 'haliarn',
					plural: 'haliarnu'
				},
				dative: {
					singular: 'halian',
					plural: 'haliahan'
				},
				accusative: {
					singular: 'haliach',
					plural: 'haliarach'
				},
				vocative: {
					singular: 'haliano',
					plural: 'halianosh'
				}
			}
		},
		{
			orcish: 'tigard',
			english: 'tiger',
			PoS: 'noun',
			noun: {
				declension: 'third',
				gender: 'feminine',
				nominative: {
					singular: 'tigard',
					plural: 'tigalz'
				},
				genitive: {
					singular: 'tigarn',
					plural: 'tigarnu'
				},
				dative: {
					singular: 'tigan',
					plural: 'tigahan'
				},
				accusative: {
					singular: 'tigach',
					plural: 'tigarach'
				},
				vocative: {
					singular: 'tigano',
					plural: 'tiganosh'
				}
			}
		},
		{
			orcish: 'lopeard',
			english: 'onyx',
			PoS: 'noun',
			noun: {
				declension: 'third',
				gender: 'feminine',
				nominative: {
					singular: 'lopeard',
					plural: 'lopealz'
				},
				genitive: {
					singular: 'lopearn',
					plural: 'lopearnu'
				},
				dative: {
					singular: 'lopean',
					plural: 'lopeahan'
				},
				accusative: {
					singular: 'lopeach',
					plural: 'lopearach'
				},
				vocative: {
					singular: 'lopeano',
					plural: 'lopeanosh'
				}
			}
		},
		{
			orcish: 'ord',
			english: 'the Ord',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'neutral',
				nominative: {
					singular: 'ord',
					plural: 'oridz'
				},
				genitive: {
					singular: 'oru',
					plural: 'orurru'
				},
				dative: {
					singular: 'oro',
					plural: 'oraes'
				},
				accusative: {
					singular: 'orudz',
					plural: 'oruluz'
				},
				vocative: {
					singular: 'oro',
					plural: 'oraes'
				}
			}
		},
		{
			orcish: 'zsagord',
			english: 'arrow',
			PoS: 'noun',
			noun: {
				declension: 'third',
				gender: 'feminine',
				nominative: {
					singular: 'zsagord',
					plural: 'zsagalz'
				},
				genitive: {
					singular: 'zsagarn',
					plural: 'zsagarnu'
				},
				dative: {
					singular: 'zsagan',
					plural: 'zsagahan'
				},
				accusative: {
					singular: 'zsagach',
					plural: 'zsagarach'
				},
				vocative: {
					singular: 'zsagano',
					plural: 'zsaganosh'
				}
			}
		},
		{
			orcish: 'laerd',
			english: 'turtle',
			PoS: 'noun',
			noun: {
				declension: 'third',
				gender: 'feminine',
				nominative: {
					singular: 'laerd',
					plural: 'laalz'
				},
				genitive: {
					singular: 'laarn',
					plural: 'laarnu'
				},
				dative: {
					singular: 'laan',
					plural: 'laahan'
				},
				accusative: {
					singular: 'laach',
					plural: 'laarach'
				},
				vocative: {
					singular: 'laano',
					plural: 'laanosh'
				}
			}
		},
		{
			orcish: 'korab',
			english: 'siege',
			PoS: 'noun',
			noun: {
				declension: 'fourth',
				gender: 'masculine',
				nominative: {
					singular: 'korab',
					plural: 'korelz'
				},
				genitive: {
					singular: 'korem',
					plural: 'korerrum'
				},
				dative: {
					singular: 'kore',
					plural: 'korero'
				},
				accusative: {
					singular: 'korenz',
					plural: 'koreluz'
				},
				vocative: {
					singular: 'korom',
					plural: 'koremo'
				}
			}
		},
		{
			orcish: 'stoab',
			english: 'kidney',
			PoS: 'noun',
			noun: {
				declension: 'fourth',
				gender: 'masculine',
				nominative: {
					singular: 'stoab',
					plural: 'stoelz'
				},
				genitive: {
					singular: 'stoem',
					plural: 'stoerrum'
				},
				dative: {
					singular: 'stoe',
					plural: 'stoero'
				},
				accusative: {
					singular: 'stoenz',
					plural: 'stoeluz'
				},
				vocative: {
					singular: 'stoom',
					plural: 'stoemo'
				}
			}
		},
		{
			orcish: 'oglaf',
			english: 'taunt',
			PoS: 'noun',
			noun: {
				declension: 'fourth',
				gender: 'masculine',
				nominative: {
					singular: 'oglaf',
					plural: 'oglelz'
				},
				genitive: {
					singular: 'oglem',
					plural: 'oglerrum'
				},
				dative: {
					singular: 'ogle',
					plural: 'oglero'
				},
				accusative: {
					singular: 'oglenz',
					plural: 'ogleluz'
				},
				vocative: {
					singular: 'oglom',
					plural: 'oglemo'
				}
			}
		},
		{
			orcish: 'darriaf',
			english: 'quagruaf',
			PoS: 'noun',
			noun: {
				declension: 'fourth',
				gender: 'masculine',
				nominative: {
					singular: 'darriaf',
					plural: 'darrielz'
				},
				genitive: {
					singular: 'darriem',
					plural: 'darrierrum'
				},
				dative: {
					singular: 'darrie',
					plural: 'darriero'
				},
				accusative: {
					singular: 'darrienz',
					plural: 'darrieluz'
				},
				vocative: {
					singular: 'darriom',
					plural: 'darriemo'
				}
			}
		},
		{
			orcish: 'thrip',
			english: 'dairy',
			PoS: 'noun',
			noun: {
				declension: 'fourth',
				gender: 'masculine',
				nominative: {
					singular: 'thrip',
					plural: 'threlz'
				},
				genitive: {
					singular: 'threm',
					plural: 'threrrum'
				},
				dative: {
					singular: 'thre',
					plural: 'threro'
				},
				accusative: {
					singular: 'threnz',
					plural: 'threluz'
				},
				vocative: {
					singular: 'throm',
					plural: 'thremo'
				}
			}
		},
		{
			orcish: 'reip',
			english: '(fake word)',
			PoS: 'noun',
			noun: {
				declension: 'fourth',
				gender: 'masculine',
				nominative: {
					singular: 'reip',
					plural: 'reelz'
				},
				genitive: {
					singular: 'reem',
					plural: 'reerrum'
				},
				dative: {
					singular: 'ree',
					plural: 'reero'
				},
				accusative: {
					singular: 'reenz',
					plural: 'reeluz'
				},
				vocative: {
					singular: 'reom',
					plural: 'reemo'
				}
			}
		},
		{
			orcish: 'kamath',
			english: 'skill',
			PoS: 'noun',
			noun: {
				declension: 'fifth',
				gender: 'neutral',
				nominative: {
					singular: 'kamath',
					plural: 'kamataz'
				},
				genitive: {
					singular: 'kamuzu',
					plural: 'kamatsu'
				},
				dative: {
					singular: 'kamord',
					plural: 'kamoran'
				},
				accusative: {
					singular: 'kamatz',
					plural: 'kamatuz'
				},
				vocative: {
					singular: 'kamordo',
					plural: 'kamonosh'
				}
			}
		},
		{
			orcish: 'veniath',
			english: 'reflection',
			PoS: 'noun',
			noun: {
				declension: 'fifth',
				gender: 'neutral',
				nominative: {
					singular: 'veniath',
					plural: 'veniataz'
				},
				genitive: {
					singular: 'veniuzu',
					plural: 'veniatsu'
				},
				dative: {
					singular: 'veniord',
					plural: 'venioran'
				},
				accusative: {
					singular: 'veniatz',
					plural: 'veniatuz'
				},
				vocative: {
					singular: 'veniordo',
					plural: 'venionosh'
				}
			}
		},
		{
			orcish: 'presat',
			english: 'kin',
			PoS: 'noun',
			noun: {
				declension: 'fifth',
				gender: 'neutral',
				nominative: {
					singular: 'presat',
					plural: 'presataz'
				},
				genitive: {
					singular: 'presuzu',
					plural: 'presatsu'
				},
				dative: {
					singular: 'presord',
					plural: 'presoran'
				},
				accusative: {
					singular: 'presatz',
					plural: 'presatuz'
				},
				vocative: {
					singular: 'presordo',
					plural: 'presonosh'
				}
			}
		},
		{
			orcish: 'kraeat',
			english: 'knee',
			PoS: 'noun',
			noun: {
				declension: 'fifth',
				gender: 'neutral',
				nominative: {
					singular: 'kraeat',
					plural: 'kraeataz'
				},
				genitive: {
					singular: 'kraeuzu',
					plural: 'kraeatsu'
				},
				dative: {
					singular: 'kraeord',
					plural: 'kraeoran'
				},
				accusative: {
					singular: 'kraeatz',
					plural: 'kraeatuz'
				},
				vocative: {
					singular: 'kraeordo',
					plural: 'kraeonosh'
				}
			}
		},
	];
}

function getVerbs() {
	return [
		{
			orcish: 'ka',
			english: 'kill',
			PoS: 'verb',
			verb: {
				conjugation: 'first',
				infinitive: {
					active: 'ka',
					passive: 'kare'
				},
				active: {
					present: {
						first: {
							singular: 'kag',
							plural: 'kagax'
						},
						second: {
							singular: 'kas',
							plural: 'kagas'
						},
						third: {
							singular: 'kak',
							plural: 'kagek'
						}
					},
					past: {
						first: {
							singular: 'ashkag',
							plural: 'ashkagax'
						},
						second: {
							singular: 'ashkas',
							plural: 'ashkagas'
						},
						third: {
							singular: 'ashkak',
							plural: 'ashkagek'
						}
					},
					future: {
						first: {
							singular: 'arkag',
							plural: 'arkagax'
						},
						second: {
							singular: 'arkas',
							plural: 'arkagas'
						},
						third: {
							singular: 'arkak',
							plural: 'arkagek'
						}
					},
					pastPerfect: {
						first: {
							singular: 'hushkag',
							plural: 'hushkagax'
						},
						second: {
							singular: 'hushkas',
							plural: 'hushkagas'
						},
						third: {
							singular: 'hushkak',
							plural: 'hushkagek'
						}
					},
					futurePerfect: {
						first: {
							singular: 'hurkag',
							plural: 'hurkagax'
						},
						second: {
							singular: 'hurkas',
							plural: 'hurkagas'
						},
						third: {
							singular: 'hurkak',
							plural: 'hurkagek'
						}
					}
				},
				passive: {
					present: {
						first: {
							singular: 'kareg',
							plural: 'karegax'
						},
						second: {
							singular: 'karas',
							plural: 'karegas'
						},
						third: {
							singular: 'karuk',
							plural: 'karegek'
						}
					},
					past: {
						first: {
							singular: 'ashkareg',
							plural: 'ashkaregax'
						},
						second: {
							singular: 'ashkaras',
							plural: 'ashkaregas'
						},
						third: {
							singular: 'ashkaruk',
							plural: 'ashkaregek'
						}
					},
					future: {
						first: {
							singular: 'arkareg',
							plural: 'arkaregax'
						},
						second: {
							singular: 'arkaras',
							plural: 'arkaregas'
						},
						third: {
							singular: 'arkaruk',
							plural: 'arkaregek'
						}
					},
					pastPerfect: {
						first: {
							singular: 'hushkareg',
							plural: 'hushkaregax'
						},
						second: {
							singular: 'hushkaras',
							plural: 'hushkaregas'
						},
						third: {
							singular: 'hushkaruk',
							plural: 'hushkaregek'
						}
					},
					futurePerfect: {
						first: {
							singular: 'hurkareg',
							plural: 'hurkaregax'
						},
						second: {
							singular: 'hurkaras',
							plural: 'hurkaregas'
						},
						third: {
							singular: 'hurkaruk',
							plural: 'hurkaregek'
						}
					}
				},
				imperative: {
					singular: 'kart',
					plural: 'karit'
				},
				gerund: {
					declension: 'second',
					gender: 'neutral',
					nominative: {
						singular: 'kon',
						plural: 'kidz'
					},
					genitive: {
						singular: 'ku',
						plural: 'kurru'
					},
					dative: {
						singular: 'ko',
						plural: 'kaes'
					},
					accusative: {
						singular: 'kudz',
						plural: 'kuluz'
					},
					vocative: {
						singular: 'ko',
						plural: 'kaes'
					},
				},
				participle: {
					feminine: {
						nominative: {
							singular: 'konad',
							plural: 'konadz'
						},
						genitive: {
							singular: 'konar',
							plural: 'konarru'
						},
						dative: {
							singular: 'konae',
							plural: 'konaes'
						},
						accusative: {
							singular: 'konaz',
							plural: 'konaruz'
						},
						vocative: {
							singular: 'konae',
							plural: 'konaes'
						}
					},
					masculine: {
						nominative: {
							singular: 'konul',
							plural: 'konulz'
						},
						genitive: {
							singular: 'konu',
							plural: 'konurru'
						},
						dative: {
							singular: 'kono',
							plural: 'konors'
						},
						accusative: {
							singular: 'konudz',
							plural: 'konuluz'
						},
						vocative: {
							singular: 'kono',
							plural: 'konors'
						}
					},
				},
				agent: {
					feminine: {
						declension: 'first',
						gender: 'feminine',
						nominative: {
							singular: 'kag',
							plural: 'kadz'
						},
						genitive: {
							singular: 'kar',
							plural: 'karru'
						},
						dative: {
							singular: 'kae',
							plural: 'kaes'
						},
						accusative: {
							singular: 'kaz',
							plural: 'karuz'
						},
						vocative: {
							singular: 'kae',
							plural: 'kaes'
						}
					},
					masculine: {
						declension: 'second',
						gender: 'masculine',
						nominative: {
							singular: 'kak',
							plural: 'kulz'
						},
						genitive: {
							singular: 'ku',
							plural: 'kurru'
						},
						dative: {
							singular: 'ko',
							plural: 'kors'
						},
						accusative: {
							singular: 'kudz',
							plural: 'kuluz'
						},
						vocative: {
							singular: 'ko',
							plural: 'kors'
						}
					},
					dishonorable: {
						declension: 'second',
						gender: 'neutral',
						nominative: {
							singular: 'kadj',
							plural: 'kadjidz'
						},
						genitive: {
							singular: 'kadju',
							plural: 'kadjurru'
						},
						dative: {
							singular: 'kadjo',
							plural: 'kadjaes'
						},
						accusative: {
							singular: 'kadjudz',
							plural: 'kadjuluz'
						},
						vocative: {
							singular: 'kadjo',
							plural: 'kadjaes'
						}
					}
				}
			}
		},
		{
			orcish: 'humai',
			english: 'to sense, perceive',
			PoS: 'verb',
			verb: {
				conjugation: 'second',
				infinitive: {
					active: 'humai',
					passive: 'humae'
				},
				active: {
					present: {
						first: {
							singular: 'humai',
							plural: 'humalax'
						},
						second: {
							singular: 'humash',
							plural: 'humahas'
						},
						third: {
							singular: 'humak',
							plural: 'humahek'
						}
					},
					past: {
						first: {
							singular: 'zsahumai',
							plural: 'zsahumalax'
						},
						second: {
							singular: 'zsahumash',
							plural: 'zsahumahas'
						},
						third: {
							singular: 'zsahumak',
							plural: 'zsahumahek'
						}
					},
					future: {
						first: {
							singular: 'zsurhumai',
							plural: 'zsurhumalax'
						},
						second: {
							singular: 'zsurhumash',
							plural: 'zsurhumahas'
						},
						third: {
							singular: 'zsurhumak',
							plural: 'zsurhumahek'
						}
					},
					pastPerfect: {
						first: {
							singular: 'huzshumai',
							plural: 'huzshumalax'
						},
						second: {
							singular: 'huzshumash',
							plural: 'huzshumahas'
						},
						third: {
							singular: 'huzshumak',
							plural: 'huzshumahek'
						}
					},
					futurePerfect: {
						first: {
							singular: 'azsurhumai',
							plural: 'azsurhumalax'
						},
						second: {
							singular: 'azsurhumash',
							plural: 'azsurhumahas'
						},
						third: {
							singular: 'azsurhumak',
							plural: 'azsurhumahek'
						}
					}
				},
				passive: {
					present: {
						first: {
							singular: 'humaeg',
							plural: 'humbelas'
						},
						second: {
							singular: 'humesh',
							plural: 'humbehas'
						},
						third: {
							singular: 'humaek',
							plural: 'humbarrak'
						}
					},
					past: {
						first: {
							singular: 'zsahumaeg',
							plural: 'zsahumbelas'
						},
						second: {
							singular: 'zsahumesh',
							plural: 'zsahumbehas'
						},
						third: {
							singular: 'zsahumaek',
							plural: 'zsahumbarrak'
						}
					},
					future: {
						first: {
							singular: 'zsurhumaeg',
							plural: 'zsurhumbelas'
						},
						second: {
							singular: 'zsurhumesh',
							plural: 'zsurhumbehas'
						},
						third: {
							singular: 'zsurhumaek',
							plural: 'zsurhumbarrak'
						}
					},
					pastPerfect: {
						first: {
							singular: 'huzshumaeg',
							plural: 'huzshumbelas'
						},
						second: {
							singular: 'huzshumesh',
							plural: 'huzshumbehas'
						},
						third: {
							singular: 'huzshumaek',
							plural: 'huzshumbarrak'
						}
					},
					futurePerfect: {
						first: {
							singular: 'azsurhumaeg',
							plural: 'azsurhumbelas'
						},
						second: {
							singular: 'azsurhumesh',
							plural: 'azsurhumbehas'
						},
						third: {
							singular: 'azsurhumaek',
							plural: 'azsurhumbarrak'
						}
					}
				},
				imperative: {
					singular: 'humort',
					plural: 'humorot'
				},
				gerund: {
					declension: 'second',
					gender: 'neutral',
					nominative: {
						singular: 'humaion',
						plural: 'humaiidz'
					},
					genitive: {
						singular: 'humaiu',
						plural: 'humaiurru'
					},
					dative: {
						singular: 'humaio',
						plural: 'humaiaes'
					},
					accusative: {
						singular: 'humaiudz',
						plural: 'humaiuluz'
					},
					vocative: {
						singular: 'humaio',
						plural: 'humaiaes'
					},
				},
				participle: {
					feminine: {
						nominative: {
							singular: 'humaionad',
							plural: 'humaionadz'
						},
						genitive: {
							singular: 'humaionar',
							plural: 'humaionarru'
						},
						dative: {
							singular: 'humaionae',
							plural: 'humaionaes'
						},
						accusative: {
							singular: 'humaionaz',
							plural: 'humaionaruz'
						},
						vocative: {
							singular: 'humaionae',
							plural: 'humaionaes'
						}
					},
					masculine: {
						nominative: {
							singular: 'humaionul',
							plural: 'humaionulz'
						},
						genitive: {
							singular: 'humaionu',
							plural: 'humaionurru'
						},
						dative: {
							singular: 'humaiono',
							plural: 'humaionors'
						},
						accusative: {
							singular: 'humaionudz',
							plural: 'humaionuluz'
						},
						vocative: {
							singular: 'humaiono',
							plural: 'humaionors'
						}
					},
				},
				agent: {
					feminine: {
						declension: 'first',
						gender: 'feminine',
						nominative: {
							singular: 'humag',
							plural: 'humadz'
						},
						genitive: {
							singular: 'humar',
							plural: 'humarru'
						},
						dative: {
							singular: 'humae',
							plural: 'humaes'
						},
						accusative: {
							singular: 'humaz',
							plural: 'humaruz'
						},
						vocative: {
							singular: 'humae',
							plural: 'humaes'
						}
					},
					masculine: {
						declension: 'second',
						gender: 'masculine',
						nominative: {
							singular: 'humak',
							plural: 'humulz'
						},
						genitive: {
							singular: 'humu',
							plural: 'humurru'
						},
						dative: {
							singular: 'humo',
							plural: 'humors'
						},
						accusative: {
							singular: 'humudz',
							plural: 'humuluz'
						},
						vocative: {
							singular: 'humo',
							plural: 'humors'
						}
					},
					dishonorable: {
						declension: 'second',
						gender: 'neutral',
						nominative: {
							singular: 'humadj',
							plural: 'humadjidz'
						},
						genitive: {
							singular: 'humadju',
							plural: 'humadjurru'
						},
						dative: {
							singular: 'humadjo',
							plural: 'humadjaes'
						},
						accusative: {
							singular: 'humadjudz',
							plural: 'humadjuluz'
						},
						vocative: {
							singular: 'humadjo',
							plural: 'humadjaes'
						}
					}
				}
			}
		}
	];
}
