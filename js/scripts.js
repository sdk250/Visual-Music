"use strict";
window.onload = function () {
	console.log("Loaded done.");
	var player,
		background,
		playPic,
		pausePic,
		nextPic,
		buttom,
		picture,
		play,
		pause,
		next,
		musicInfo,
		status,
		that,
		bar,
		canvas,
		ctx,
		cW,
		cH;

	/* init Background widget */
	background = document.getElementById("background");

	/* init Player position */
	player = document.getElementById("player");
	player.style.top = (window.innerHeight / 2.2 - player.clientHeight / 2) + "px";
	player.style.left = (window.innerWidth / 2 - player.clientWidth / 2) + "px";
	player.style.borderRadius = "15px 50px 30px 5px";

	/* Keep window pointer */
	that = this;

	/* Next button click check */
	this.nextClick = false;

	/* init XMLHttpRequest widget */
	//xhr = new XMLHttpRequest();

	/* init Audio object */
	this.audio = new Audio();

	/* init AudioContext object */
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	this.audioContext = new AudioContext();

	/* init MediaElementSource widget */
	var mediaElementSource = this.audioContext.createMediaElementSource(this.audio);

	/* init Analyser widget */
	var analyser = this.audioContext.createAnalyser();

	/* init Player status */
	status = 0;

	/* init Canvas widget */
	canvas = document.getElementById("canvas");
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	ctx = canvas.getContext("2d");
	cW = canvas.width;
	cH = canvas.height;
	
	/* init draw widget */
	var du = 2;
	var R = 140;
	var W = 2;

	/* init Picture widget */
	pausePic = "data:image/png;base64,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"
	playPic = "data:image/png;base64,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"
	nextPic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAABf5SURBVHic7d17eFx1ncfxz3dmktLS0CJ30KJiV9iiw8w5p4khIOGmiCJoKz5F7rLcym3B1RW5g8gWRVoEuywXoeyuIFVUEOHRAE+JyZzfOWOCdVkrt4oitLqmQ5swl/PdP5oq1JYmc/vOOef7eh7/40ne2H74TSZzzgGUUkoppZRSSimllFJKKVUfJB3Qynzf35OIdi2VSm1TpkxZOzo6+qeurq510l1KTZYOfVwul3tXIpE4FoDFzHOIaPZW/tG1AJ4mohWJROLxTCbzYvMqlapOrIeey+V2TyQSxwE4FkBnlV/GB/BQpVJZ1tnZ+af61SlVP7Ec+sqVK98xNjb2lSAITiaiZJ2+7P8BuNKyrHuIiOv0NZWqi1gNva+vb7uOjo5ziegiZp7eiO9BRG4QBBc5jvOrRnx9paoRm6H7vr9nEATLAezb6O/FzBUiWgrgWtu2NzT6+ym1LbEYuuu6+xPRcgC7Nvlbvwzgi7ZtP9zk76vUW0R+6L7vHxYEwb0Apkk1MPPPiGihbduvSDWoeIv00HO5nENEj9bxDbdarCei67PZ7G1EVJGOUfES2aEPDw/vWCwWcwB2kW7ZzLOJROLMbDY7JB2i4iMhHdAIzJwoFovL0HojB4B9gyDoM8Z8fWBgYAfpGBUPkRy653n/AuBA6Y63kQBweiqVMsaYY6VjVPRF7qX7wMDAbqlU6hkA7dItE8XMT42/WbdaukVFU+RO9FQqdQlCNHIAIKKDAeSMMZf09fWlpHtU9ETqRB//UMyvpTtq9FtmvsBxnKelQ1R0ROpEZ+ZLpBvq4H1E9LAx5lvGmBnSMSoaojb046Ub6ugEAL/0ff9E6RAVfpF56Z7L5boTicQj0h0NMtjW1nZWOp1+QTpEhVNkTvREIvFh6YYG6iyVSoOe5126atWqKdIxKnwiM3QAh0gHNFg7M39hZGTE9X3/YOkYFS6ReelujHkJQJzevPoegC/Ztr1WOkS1vkic6MxMiNfIAWAeAM913dPG//2V2qpI/AXJ5/MzK5XKi9IdUph5iIjOtG37WekW1ZoicaIDmCkdIImI0gBWGGOuMcaIXXevWlckhs7McXvZviUpAOcB8HzfP0w6RrWWSAydiPS+bH+zRxAEDxpjlhlj9pCOUa0hEkM/4IADnmdmvWvLW32ciFxjzDnMHIk/Z1W9SPwFIKIKEf1WuqPVjN/S+que5z3l+35aukfJicTQAYCZfyPd0ML2H7+rzaK+vr6G3M9etbbIDJ2IjHRDi0sAOKOjo8NzXXeedIxqrkj8Hh0AfN/fOwgCveHixPUBuEDvahMPkTnRs9nsSwCGpTtCpBfAgOd5C/XNuuiL1B8wM39fuiFkpjHztZ7nPZnL5eZIx6jGidrQvyfdEFIfSCQSTxpjLtfLYKMpMj+jb+K67j1EdIx0R4i9BOBc27ZXSIeo+onc0AcGBt6ZSqVcAFOlW8KMme8loq/Ytj0i3aJqF6mX7gDQ1dX1MoBF0h1hR0QnAvCMMUdLt6jaRe5EBwBmTnqe9xCAHumWKGDmHyaTyYuz2ewa6RZVncid6MDGj8SWy+UFAJ6TbokCIjomCALX87xPSbeo6kTyRN8kn8+/u1KpPIn43X2mkb4P4EL92T1cInmib5LJZF5k5vkA3pBuiZDjAOR834/yXXcjJ9In+ib5fP6ASqVyD4BZ0i0Rc3uhUList7d3TDpEvb1In+ibZDKZXxYKhW4i+m/plog5o6Oj42ljTFY6RL29WJzob+a67qeJ6EYAO0q3RAkRLbIs6zrpDrVlsRs6ABhjZjDzdUR0AmL6/0GDDAM41bZt/W1Hi4n1X3JjTCcz30JEs6VbImSUiL5gWdYy6RD1N7EeOgD09fWlOjo6LgBwCfRjs/X0QFtb24XpdHq9dIjSof+VMWbW+OmuzzWrn+eCIDhp7ty5K6VD4k6HvhnP845j5usB7C7dEhFjRPSvlmXdJR0SZzr0Lejr65ve0dFxBYDTEZNfQTbBQ2NjYwt7enoK0iFxpEN/G77vp4Mg+BaA/aVbIuIlIjrRsiy95VeT6dC3gZkTnuedRURfHr9PuqpNkZkvcxxnqXRInOjQJ2j88UY3AtDrs+vjEQBn68UxzaFDnyTf9w8LguAWAPpcs9qtrlQq8zo7O/XhGw2mbzRNUjab/RkAi5lvAVCW7gm5WalU6ufGmCOlQ6JOT/QaGGP2Zeal488nV9ULiOhqy7K+KR0SVTr0GjEzGWNOI6LLoTe4qNUPCoXCWXrZa/3p0OvEGLMzEd3AzJ+Wbgm5YQDH27b9inRIlOjQ68z3/YPH36zTm1xUbw02jt2XDokKHXoDrFq1asrIyMgXAJwPoF26J6SKRLTQsqz7pUOiQIfeQPl8fnalUrkFQKd0S4jdYNv29dIRYadDbwLf908MguBa6Jt1VWHmex3HOU+6I8x06E2ycuXKd4yOjl4LYIF0S0g9PmPGjM/Nnj1b7+hbBR16k43f1ebbRPQe6ZYQygGYrx+bnTwduoCVK1e2b9iw4QIiuhjAdtI9YcLMq0ql0rHd3d2/l24JEx26IL2rTdVeTSaTH89kMqukQ8JCh94CXNedR0RfBbCrdEuIjDDzfMdxctIhYaAXtbQAx3G+Vy6XbSK6EwBL94TEDCL64eDg4IekQ8JAT/QWM35Xm6UA9pVuCYkNlUrl052dnb+QDmllOvQWNP5893MAfAnA9tI9IaBj3wYdegvr7+/fq729fQmAQ6VbQkDH/jZ06CFgjJkP4GsAdpJuaXE69q3QoYdEPp+fGQTB15j5s9ItLU7HvgU69JDxPO8gAN9m5r2kW1qYjn0zOvQQGhoa2r5UKl0K4Czor0i3Zn0QBEfq46A20qGHmOu6GSL6NoD3S7e0qNcAHG7b9mrpEGl6GoSY4zh5AD1EtIiZK9I9LWhXAD/I5/MzpUOk6YkeEcaYLIDbAewj3dJqiMjdbrvtjp4zZ05RukWKnugRYdu2XygUDgRwG/RjtG/BzM7o6OidzBzbv+96okeQ67oHEtFt0BtUbu5u27YvlI6QENv/wkWZ4zhPFwqFbmZeJt3SYk7xPC+WQ9cTPeJc1z2KiBYD2EW6pVUQ0fGWZf1UuqOZdOgxMDg4uFMymbwd+pl5AAARvZ5KpQ5Kp9MvSLc0iw49RjzPO5eZrwTQJt0ijYh+w8yH2La9QbqlGfRn9BixLOtbyWTyCACx/wAJM/8DMy+V7mgWHXrMZDKZXxYKhW4AD0u3SCOiTxhjzpbuaAZ96R5jruueREQ3AJgq3SKFmSvM/NG5c+e60i2NpEOPuXw+P7tcLv8nEc2WbhG0JpFIdGez2TXSIY2iL91jLpPJrCqVSgcz84+kWwTtEgTBrdIRjaQnuvorz/MuZObLEdMDgIhOsyxruXRHI+jQ1VuMP999GYAdpFsEvDo2Nmb39PQUpEPqLZb/5VZbl81mn2pra/swM8fxKSi7TZ069SrpiEbQE11t0dDQ0PblcvkOZv6odEuTMTMfOn6tf2Toia62KJ1Or7cs67MAFku3NBkR0RLpiHrToau3Zdv25cx8MYBAuqWJ9jfGXCAdUU/60l1NiOu6RxDRdwBMk25pktFyuex0dXW9LB1SD3qiqwlxHOdxAB8BsFa6pUmmplKpm6Qj6kWHribMtu1nABwao3fkjzDG9EhH1IMOXU2KbduriehwACukW5rkHOmAetCf0VVVjDFtAO4H0Cvd0mCcTCYzmUzmRemQWuiJrqpi23YJwGcARP2WTFSpVBZKR9RKh66qZtt2qVAonADgx9ItDbZgeHh4R+mIWujQVU16e3vLlmWdjGiPfVqxWDxVOqIWOnRVMyKqWJZ1MhE9KN3SQGf19fWlpCOqpUNXdUFElWw2ewaAR6RbGmTX6dOnz5OOqJYOXdUNEQVTp049hYgi+VxyIjpXuqFaOnRVV3PmzCmOjo5+hoh+Ld3SAB/wPO8g6Yhq6NBV3fX09BRSqdSxAH4n3VJvzDxfuqEaOnTVEOl0+rW2trZjmPnP0i31xMx6oiv1Zul0+oVEInEsgPXSLfVCRO8ZGBjYTbpjsnToqqEsyxpm5s9Ld9RTKpU6TLphsnToquEcx/kJgBulO+oodC/fdeiqKSzL+iqic8Vb6J5Kq0NXTTH+O/aTAPxBuqUOdjPG7CMdMRk6dNU0c+bM+TOAz0l31EmobkihQ1dNZdu2D+B66Y5aMfOHpRsmQ4eumq5QKHwdwP9Id9SCiPaTbpgMHbpqut7e3jIRnQmApVtqsKt0wGTo0JUIy7KGATwg3VGDdzBzaG7FpkNXYpg5zE+BocHBwdCc6jp0JcZxnF8hxPecS6VSOnSlJui/pAOqRUS7SDdMlA5dSetDSN+UC4JAT3SlJsK27REAz0l3VCORSOws3TBROnQljohelG6oBjPria7URAVB8Ip0QzWYOTT3etehK3FEtJN0QzWI6HXphonSoStxzLyXdEOV1kgHTJQOXYnq7++fGrbPjW+SSCR06EpNxJQpU44C0C7dUY1KpfIn6YaJ0qErUcwc2meaMbOe6Epti+/7aYTw/mubtLW16dCV2pYgCC6VbqjF+vXrQ/PSPTSX2alocV33QCJ6WLqjBiXbtvWz7kptzfg77bdJd9Toj9IBk6FDV03X3t5+OYBZ0h01CtWtsHToqqmMMfMBnC3dUSsielK6YTJ06KppXNfNALhVuqMemPkp6YbJ0DfjVFP09/fv1d7e/hSAUH6ufTMjtm3vLR0xGXqiq4br7++f2t7evhzRGDmw8WYZoaJDVw01PvIHALxfuqVewvbzOaBDVw30ppGH6vFF25JKpZ6QbpislHSAiqbxkf8AQKd0S52tSafTL0hHTJae6KruIjxyAHhMOqAaOnRVVxEfOYIgCNWv1TbRl+6qbowxewD4LoAPSrc0SKFYLD4iHVENHbqqC8/zPsjMDwIIzYUeVbirp6enIB1RDX3prmpmjDmamR9DtEdeBhDaC3F06KomxpgvAVgGYDvplga737btUN6WGtCX7qpK+Xx+ZqVSWQrgI9ItzUBE35BuqIUOXU1aLpdzKpXKvQB2l25pkscsy/qtdEQt9KW7mjBmJmPMJUT0KOIzcgAI83PcAejVa2qChoaGdi2VSncgxDdzrAYR/dqyrG7pjlrpS3e1TZ7nHVQqle5GdK4+mzBm/jfphnrQE11t1dDQ0PalUulqAKchnn9XPMuyDieiUD6//c30RFdb5HneoeVyeQmAsD4XrVZFZj4jCiMHdOhqM+O/NlvEzPOlWyQx8/WO4zwv3VEvcXw5prbCdd15RHQDYviz+GaesSzrECKqSIfUi57oCrlcbvdEInErgEOlW1pAGcAZURo5oEOPtVWrVk0ZGRlZSEQXMfN06Z5WQEQ3WZb1rHRHvenQY8r3/WNGRkauAbA3cyTeb6qH59etW3eDdEQj6M/oMeN53n7MvAgRu49bHTARHW5Zlicd0gh6osfE4ODgTslk8gpmPkm6pUUtierIAR165BljpjHzQiJaCGAH6Z4WNQDgGumIRtKX7hG1cuXK9tHR0dMBXAxgZ+meFvZyMpnsyWQyf5EOaSQdesQwczKfzy8IguCLAN4p3dPiRgH02rYduXfZN6dDjwhmJs/zPsnMlxLRbOmeMGDmBY7jhPJmj5OlQ48A13UPB3AZEaWlW0LkBtu2r5eOaBYdeoh5nvcRZr4YwFzplpB5xLKsE6JywcpE6LvuITN+l5djiOhiZo7q/dMb6dlisXh6nEYO6IkeGsycNMbMJ6KLEKEnkzbZ6nK5fERXV9er0iHNpkNvccaYNiI6gZkvBPBu6Z4QW10sFo/q7u7+vXSIBB16izLGTCOiU5n5fAC7SfeE3B8AfNS27dXSIVJ06C3GGLMzgLMBnA5gpnBOFLwK4Ig4jxzQN+Nahuu67yWiCwEcD2CKdE9EvMrMRzmOE+uRA3qiixscHPxQMpk8D8BR0D+PelrLzEdG6XZQtdC/WAKYmXzfP3r852/9HXj9rW5ra/tkOp1+QTqkVejQm2jVqlVT1q1bt4CZFwLYR7onop4BcJxt22ulQ1qJDr0J8vn8zHK5/E9EdAai/WhhaU8AWGDb9gbpkFajQ28gY8wsIlrIzJ8DME26J+Lutyzr7Kjd1LFe9F33BvA874PMfBEzHwMgKd0TdUS0yLKs66Q7Wpme6HVkjDkaG38Hrvdja5JEInFeNpu9V7qj1emJXiNjTBuA+QDOA7CfcE6cjDHzidls9nHpkDDQE71KAwMDO6RSqVMAnAVgT+GcuHkpCIIFc+fOXSkdEhY69EkyxuwB4BwAJ0Nvtijh8bGxsdN6enoK0iFhokOfIGPMvgAuADAPQJtwThyVAVxj2/bN0iFhpEPfBt/3D2bm85n5cOmWGHsVwEm2bQ9Kh4SVDn0Lxm/ycCyA8/U+bOIGAZygn3SrjQ79TYwx0wCchI0/g88Szok7BrDYsqyr9UMwtdOhY+M14ER0JjN/HsCO0j0KI8z8ecdx9FdndRLroY9fA34+gM8C2E66RwEAVgA4w7btV6RDoiSWQzfGdAI4HxuvAU8I56iNCkR0mWVZd0uHRFFshj7+JJOPYePAO6V71FusKJfLZ3V1db0sHRJVsRi653mfYOYrALxPukW9xQYi+rKe4o0X6aF7nrcfMy+CXmTSivQUb6JIDn14eHjHYrH4FWY+hYj0MtEWQkSvB0FwheM4d0i3xEnkhu77/t5BEDwKYA/pFvV3HgqC4Itz5879o3RI3ERq6MaYfQA8Cr1dU6t5DsAFtm2vkA6Jq8j8aml4eHhHAD+GjrxlENHrAK4oFAqdOnJZkbjxBDMnPc9bBn253jKYeXkQBF/Wl+mtIRJDN8ZcRUQHSncogIh+A+B827YHpFvU34T+Z3TXdT9JRN+R7lBYB+Brtm3fKh2i/l6oh97f3z+1vb39VwB2km6JMyJaysyL9FLS1hXql+5tbW0nQUcuhYloOTNfZVlW7B9i2OpCPXQiWijdEEfM/GQikbjMsqxh6RY1MaEdei6XOx7Au6Q74oSZh4joSsdx+qRb1OSEdujJZPIUZpbOiIvVzHyV4zgPSoeo6oTyzbihoaHtS6XSywhpf4isYeYbiehO27ZL0jGqeqE80Uul0iHQkTfSWgDfKBaLd3V3d49Kx6jahXLoAHqlAyJqDYDFxWLxP3Tg0aJDVwDwGhHdvG7dujt6e3vHpGNU/YXu5S8zJzzP+7N0R0S8CuDmQqFwpw482kJ3onue1yHdEAGvAFg8Y8aMO2fPnv2GdIxqvNANvVwud6RSoctuFX9g5ptnzpx5tw48XkK3mGQyub10Qwi9RETftCzrLukQJSN0Q2fmDUShe2tBBBG5ABZns9kfE5F+uijGQreY8fuzr0EI/yPVJAzgJ5VKZUlnZ+cvpGNUawjdWIiIjTEvQu/Rvrk3AHyXmb/pOM7z0jGqtYRu6OOehw59k3XMfE97e/vidDr9mnSMak1hHfoAgCOlI4StBnAbgO84jrNBOka1tlAOPQiCBxKJxOXSHUKGASyxLGu5PjdcTVTo3ozbxHXdJ4joAOmOJvo5My92HOcJ6RAVPqE80QGAiJYDiPrQS+O3a7rJtu1npWNUeIV26EEQfD+RSFwt3dEg64novjfeeOPm7u7u30vHqPAL7Ut3AHBd9yYiOlW6o47+CODWcrl8d1dX1zrpGBUdoT3RAYCIrgMwD0DYL3T5XyJabFnWfdIhKppCfaIDgOd5C5n5WumOKq0goiWWZf1UOkRFW6hPdABg5qUATgPwXumWiWDmChH9iIi+obdLVs0S+hMdAAYGBv4xlUr9FK39En4DgPsALLFtWx94oJoqEkMHgMHBwQ8lk8mHALRLt2xmLYDbk8nk0kwm8xfpGBVPkRk6ALiu+zEiug+t8e/1PDPfMnPmzPv0Jg9KWisMoq5c1z2CiP4dwI4S31+vAVetKHJDBwDf9/cMguBeAFaTvqVeA65aWiSHDgB9fX2p6dOnX0VE5zbw2+g14CoUIjv0TXK53JxEInERMx9HRMk6fdm/ALgDwG36THAVBpEf+ibGmFkA/hnApwDsUOWX6WPm+0ql0sP6JBMVJrEZ+pv5vn9wEARHATgawKy3+Ud/R0S/A/AYM3/Xtu1XmlOoVH3FcuhvZoyZBmDGpv8R0SgRvZLNZtcIpymllFJKKaWUUkoppZRSSqmW8/9eBNbnnBNJRAAAAABJRU5ErkJggg=="

	/**
	 * add Element and id
	 * 
	**/
	addPlayerDivElement(buttom, "buttom");
	addPlayerDivElement(picture, "picture");
	addPlayerDivElement(play, "play");
	addPlayerDivElement(pause, "pause");
	addPlayerDivElement(next, "next");
	addPlayerDivElement(musicInfo, "musicInfo");
	bar = document.createElement("div");
	buttom.appendChild(bar);

	/**
	 * init Player widget
	 * 
	**/
	/* is Buttom widget */
	buttom.style.position = "absolute";
	buttom.style.width = "200px";
	buttom.style.height = "80px";
	buttom.style.backgroundColor = "rgba(66, 66, 66, 0.4)";
	buttom.style.filter = "blur(4px)";
	buttom.style.borderRadius = "5px 5px 30px 5px";
	buttom.style.top = "40px"; /* playerHeight - buttomHeight */
	buttom.style.zIndex = 2;
	/* is Picture widget */
	picture.style.position = "absolute";
	picture.style.width = 80 + "px";
	picture.style.height = 80 + "px";
	picture.style.borderRadius = "60px";
	picture.style.backgroundImage = "url(./img/0.jpg)";
	picture.style.backgroundSize = "100% auto";
	picture.style.animation = "turn 12s linear infinite";
	picture.style.animationPlayState = "paused";
	picture.style.zIndex = 3;
	/* is Play widget */
	play.style.position = "absolute";
	play.style.top = "50%";
	play.style.left = (buttom.clientWidth / 2 - 20) + "px";
	play.style.width = "46px";
	play.style.height = "46px";
	play.style.backgroundImage = "url(\"" + playPic + "\")";
	play.style.backgroundSize = "100% auto";
	play.style.filter = "blur(1px)";
	play.style.display = "inline";
	play.style.zIndex = 3;
	/* is Pause widget */
	pause.style.position = "absolute";
	pause.style.top = "50%";
	pause.style.left = (buttom.clientWidth / 2 - 20) + "px";
	pause.style.width = "46px";
	pause.style.height = "46px";
	pause.style.backgroundImage = "url(\"" + pausePic + "\")";
	pause.style.backgroundSize = "100% auto";
	pause.style.filter = "blur(1px)";
	pause.style.display = "none";
	pause.style.zIndex = 3;
	/* is Next widget */
	next.style.position = "absolute";
	next.style.top = "50%";
	next.style.left = (buttom.clientWidth / 2 + 40) + "px";
	next.style.width = "46px";
	next.style.height = "46px";
	next.style.backgroundImage = "url(\"" + nextPic + "\")";
	next.style.backgroundSize = "100% auto";
	next.style.filter = "blur(1px)";
	next.style.zIndex = 3;
	/* is musicInfo widget */
	musicInfo.style.position = "absolute";
	musicInfo.style.top = "0%";
	musicInfo.style.left = (buttom.clientWidth / 2 - 10) + "px";
	musicInfo.style.width = "105px";
	musicInfo.style.height = "auto";
	musicInfo.style.overflow = "hidden";
	musicInfo.style.whiteSpace = "nowrap";
	musicInfo.style.fontStyle = "bolder";
	musicInfo.style.color = "white";
	musicInfo.style.textShadow = "2px 2px 4px #000000";
	musicInfo.style.zIndex = 3;
	/* is bar widget */
	bar.style.position = "absolute";
	bar.style.width = "200px";
	bar.style.height = "80px";
	bar.style.backgroundColor = "rgba(0, 0, 0, 0.3)"; //"\"" + getColor() + "\"";
	bar.style.filter = "blur(4px)";
	bar.style.borderRadius = "5px 5px 30px 5px";
	bar.style.display = "none";
	bar.style.zIndex = 2;
	/* is Canvas widget */
	canvas.style.top = (window.innerHeight / 2.2 - canvas.clientHeight / 2) + "px";
	canvas.style.left = (window.innerWidth / 2 - canvas.clientWidth / 2) + "px";

	/* on window change */
	window.onresize = function () {
		player.style.top = (window.innerHeight / 2 - player.clientHeight / 2) + "px";
		player.style.left = (window.innerWidth / 2 - player.clientWidth / 2) + "px";
		canvas.style.top = (window.innerHeight / 2 - canvas.clientHeight / 2) + "px";
		canvas.style.left = (window.innerWidth / 2 - canvas.clientWidth / 2) + "px";
		console.log("chenge!");
	};

	/* on click Event */
	play.addEventListener("click", Play);
	pause.addEventListener("click", Pause);
	next.addEventListener("click", Next);
	rq();
	function rq() {
		Ajax({
			"method": "GET",
			"url": "http://api.uomg.com/api/rand.music",
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			"parameter": {
				"sort": "热歌榜",
				"format": "json"
			},
			"dataType": "text",
			"responseType": "json",
			"success": function () {
				console.log(window.JSON.stringify(this.response));
				getMusicURL(this);
				playerInit(this);
			}
		});
	}
	function getMusicURL(that) {
		Ajax({
			"method": "GET",
			"url": "http://49.234.64.33:9001",
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			"parameter": {
				"songids": /url\?id\=(\d{3,12})/.exec(that.response.data.url)[1]
			},
			"dataType": "text",
			"responseType": "json",
			"success": function () {
				console.log(this.response);
				if (this.response.data[0].size == 0) {
					window.alert("The current song has no copyright, Please next song.");
					Next();
					return false;
				}
				getMusicData(this)
			}
		});
	}
	function getMusicData(that) {
		Ajax({
			"method": "GET",
			"url": that.response.data[0].url,
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			"responseType": "blob",
			"success": function () {
				console.log(this.response);
				decodeAudio(window.URL.createObjectURL(this.response));
			}
		});
	}
	function decodeAudio(musicUrl) {
		that.audio.src = musicUrl;
		analyser.fftSize = 512;
		mediaElementSource.connect(analyser);
		analyser.connect(that.audioContext.destination);
		that.audioContext.resume();

		status = 1;
		that.audio.addEventListener("canplay", function () {
			barAnimation(window.Math.floor(this.duration));
		});
		that.audio.addEventListener("ended", function(){
			Next();
			console.log("Restart");
		});
		that.nextClick = false;
		if (that.audioNext == true) {
			Play();
			that.audioNext == false;
		}

		var color1 = ctx.createLinearGradient(cW / 2, cH / 2 - 10, cW / 2, cH / 2 - 150);
		color1.addColorStop(0, getColor());
		color1.addColorStop(0.25, getColor());
		color1.addColorStop(0.5, getColor());
		color1.addColorStop(0.75, getColor());
		color1.addColorStop(1, getColor());

		var bufferLength = analyser.frequencyBinCount;
		var array = new Uint8Array(bufferLength);

		var Rv1, Rv2;
		!(function draw() {
			analyser.getByteFrequencyData(array);
			ctx.clearRect(0, 0, cW, cH);
			for (var i = 0; i <= bufferLength; i++) {
				var value = array[i] / 8;
				ctx.beginPath();
				ctx.lineWidth = W;
				Rv1 = (R - value);
				Rv2 = (R + value);
				ctx.moveTo((Math.sin((i * du) / 180 * Math.PI) * Rv1 + cW / 2), - Math.cos((i * du) / 180 * Math.PI) * Rv1 + cH / 2);
				ctx.lineTo((Math.sin((i * du) / 180 * Math.PI) * Rv2 + cW / 2), - Math.cos((i * du) / 180 * Math.PI) * Rv2 + cH / 2);
				ctx.strokeStyle = color1;
				ctx.stroke();
			}
			window.requestAnimationFrame(draw) || window.webkitRequestAnimationFrame(draw);
		})();
	}
	function addPlayerDivElement(value, id) {
		value = document.createElement("div");
		player.appendChild(value);
		switch (id) {
			case "buttom" :
				value.id = "buttom";
				buttom = document.getElementById("buttom");
				break;
			case "picture" :
				value.id = "picture";
				picture = document.getElementById("picture");
				break;
			case "play" :
				value.id = "play";
				play = document.getElementById("play");
				break;
			case "pause" :
				value.id = "pause";
				pause = document.getElementById("pause");
				break;
			case "next" :
				value.id = "next";
				next = document.getElementById("next");
				break;
			case "musicInfo" :
				value.id = "musicInfo";
				musicInfo = document.getElementById("musicInfo");
				break;
			default :
				window.alert("init Element Error");
				console.log("init Element Error");
				break;
		}
	}
	function getColor() {
		var str = "#";
		var random;
		var aryNum = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
		for (var i = 0; i <= 5; i++) {
			str += aryNum[Math.floor(Math.random() * 16)];
		}
		return str;
	}
	function Play() {
		console.log("Play is click!");
		if (status == 1) {
			that.audioContext.resume();
			that.audio.play();
			playAnimation();
		} else {
			window.alert("Song is not Loaded!");
			return false;
		}
	}
	function Pause() {
		console.log("Pause is click!");
		if (status == 0) {
			that.audio.pause();
			pauseAnimation();
		}
	}
	function Next() {
		if (that.nextClick == true) {
			console.log("Don't click");
			return false;
		}
		that.nextClick = true;
		status = 0;
		console.log("Next is click!");
		Pause();
		rq();
		that.audioNext = true;
		bar.style.animationName = "none";
		bar.style.display = "none";
		nextAnimation();
		next.addEventListener("animationend", function () {
			next.style.animationName = "none";
			console.log("Next animation is end.");
		});
	}
	function playerInit(result) {
		background.style.backgroundImage = "url(\"" + result.response.data.picurl + "\")";
		picture.style.backgroundImage = "url(\"" + result.response.data.picurl + "\")";
		musicInfo.innerHTML = "<p id=\"mName\">" + result.response.data.name + "</p>" + "<p id=\"mPeo\" style=\"font-size: 10px;\">" + result.response.data.artistsname + "</p>";
		console.log("text:", musicInfo.scrollWidth);
		console.log("content:", musicInfo.clientWidth);
		if (document.getElementById("mName").scrollWidth > musicInfo.clientWidth) {
			console.log("Text is long.");
			musicNameAnimation();
		} else if (document.getElementById("mPeo").scrollWidth > musicInfo.clientWidth) {
			console.log("Text is long.");
			musicPeoAnimation();
		}
	}
	function barAnimation(time) {
		bar.style.display = "inline";
		bar.style.backgroundColor = getColor();
		bar.style.animationName = "bard";
		bar.style.animationDuration = time + "s";
		console.log(bar.style.animationDuration);
		bar.style.animationTimingFunction = "linear";
		bar.style.animationIterationCount = 1;
		bar.style.animationDirection = "normal";
		if (that.audio.paused == true) {
			bar.style.animationPlayState = "paused";
		}
	}
	function nextAnimation() {
		next.style.animationName = "sTurn";
		next.style.animationDuration = "0.2s";
		next.style.animationTimingFunction = "linear";
		next.style.animationIterationCount = 6;
		next.style.animationDirection = "alternate";
	}
	function playAnimation() {
		bar.style.animationPlayState = "running";
		picture.style.animationPlayState = "running";
		play.style.animationName = "cShow, zoomOut";
		play.style.animationDuration = "0.4s, 0.15s";
		play.style.animationTimingFunction = "linear, linear";
		play.style.animationIterationCount = "1, 1";
		play.style.display = "none";
		pause.style.animationName = "show, zoomIn";
		pause.style.animationDuration = "0.4s, 0.15s";
		pause.style.animationTimingFunction = "linear, linear";
		pause.style.animationIterationCount = "1, 1";
		pause.style.display = "inline";
		status = 0;
	}
	function pauseAnimation() {
		bar.style.animationPlayState = "paused";
		picture.style.animationPlayState = "paused";
		pause.style.animationName = "cShow, zoomOut";
		pause.style.animationDuration = "0.4s, 0.15s";
		pause.style.animationTimingFunction = "linear, linear";
		pause.style.animationIterationCount = "1, 1";
		pause.style.display = "none";
		play.style.animationName = "show, zoomIn";
		play.style.animationDuration = "0.4s, 0.15s";
		play.style.animationTimingFunction = "linear, linear";
		play.style.animationIterationCount = "1, 1";
		play.style.display = "inline";
		status = 1;
	}
	function musicNameAnimation() {
		document.getElementById("mName").style.animationName = "wordsLoop";
		document.getElementById("mName").style.animationDuration = "6s";
		document.getElementById("mName").style.animationTimingFunction = "linear";
		document.getElementById("mName").style.animationIterationCount = "infinite";
	}
	function musicPeoAnimation() {
		document.getElementById("mPeo").style.animationName = "wordsLoop";
		document.getElementById("mPeo").style.animationDuration = "6s";
		document.getElementById("mPeo").style.animationTimingFunction = "linear";
		document.getElementById("mPeo").style.animationIterationCount = "infinite";
	}
};