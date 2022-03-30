-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2022. Feb 08. 19:38
-- Kiszolgáló verziója: 5.7.17
-- PHP verzió: 7.1.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `hszkdb_v2,1`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `citations`
--

CREATE TABLE `citations` (
  `ID` int(11) NOT NULL,
  `DocID` int(11) NOT NULL,
  `Text` varchar(1000) COLLATE utf8_hungarian_ci NOT NULL,
  `CCId` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `citations`
--

INSERT INTO `citations` (`ID`, `DocID`, `Text`, `CCId`) VALUES
(1, 1, 'gazdÃ¡lkodÃ¡s (commons) ', 880132922),
(2, 1, 'rendszerszintÅ±', 973792711),
(3, 1, 'okoznak,', -1674946867),
(4, 1, '2025-re 1,8 milliÃ¡rd ', -1284030910),
(5, 1, 'kihalÃ¡si hullÃ¡mot ', -1960022265),
(6, 2, '(commons) ', 1722474299),
(7, 2, '(Escobar, Arturo 2015)', -1826191965),
(8, 2, 'AntropocÃ©n', -66882592),
(9, 2, 'rendszerekre (Zsolnai et al., 2004). ', -2093229069),
(10, 2, 'novemberÃ©ben 15 ', 767127284),
(11, 3, 'Ã©s tÃ¡rsadalmi ', -561794645),
(12, 3, 'meg a kapitalizmuskritika', 26915045),
(13, 5, 'alakulnak Ã©s', -1232378075),
(14, 5, 'kapitalizmuskritika', -2085449585),
(15, 5, 'Ã¶nszervezÅ‘dÃ©si kÃ©pessÃ©gÃ©', 446199308),
(16, 5, 'mavÃ¡ltÃ¡st', 6262541),
(17, 5, 'inkÃ¡bb nÃ¶vekvÅ‘ ', -1495174635),
(18, 5, 'elsÅ‘sorban az elmÃºlt ', 48811563),
(19, 5, ', intenzÃ­vebb csapadÃ©khullÃ¡st ', 1914587458),
(20, 5, '2025-re 1,8 milliÃ¡rd ember ', 1293786274),
(21, 5, '30000 km2-rel nÅ‘tt, ugyanezen ', 2110152311),
(22, 6, 'felismerhetÅ‘k kÃ¶zÃ¶s elemek', -996798626),
(23, 7, 'Ugyanakkor felismerhetÅ‘k ', 262043563),
(24, 7, 'rendszerszintÅ± paradigmavÃ¡ltÃ¡s ', 658346308),
(25, 7, 'terhet helyezÃ¼nk az Ã¶kolÃ³giai ', -1661224546),
(26, 8, '(Escobar, Arturo 2015). ', 1482193176),
(27, 8, '(Zsolnai et al., 2004).', 675928562),
(28, 8, '(Ã“csai, 2012:2-4). ', 883524667),
(29, 8, '(Mortillaro, 2017). ', -844633780),
(30, 8, 'Bollier, David (2015): ', 1058049119);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `docnames`
--

CREATE TABLE `docnames` (
  `ID` int(11) NOT NULL,
  `DocName` varchar(200) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `docnames`
--

INSERT INTO `docnames` (`ID`, `DocName`) VALUES
(1, 'fulltestv2_1'),
(2, 'test3'),
(3, 'test1020'),
(4, ''),
(5, 'test01201'),
(6, 'test01202'),
(7, 'test01203'),
(8, 'test0502');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `docverzions`
--

CREATE TABLE `docverzions` (
  `ID` int(11) NOT NULL,
  `DocID` int(11) NOT NULL,
  `vName` varchar(256) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `docverzions`
--

INSERT INTO `docverzions` (`ID`, `DocID`, `vName`) VALUES
(1, 1, 'A'),
(2, 7, 'A'),
(3, 7, 'B'),
(4, 8, 'Feri');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `errors`
--

CREATE TABLE `errors` (
  `ID` int(11) NOT NULL,
  `CitationID` int(11) NOT NULL,
  `DocID` int(11) NOT NULL,
  `DocVerzionID` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `errors`
--

INSERT INTO `errors` (`ID`, `CitationID`, `DocID`, `DocVerzionID`) VALUES
(1, 2, 1, 1),
(2, 4, 1, 1),
(3, 5, 1, 1),
(4, 23, 7, 2),
(5, 24, 7, 2),
(6, 23, 7, 3),
(7, 24, 7, 3),
(8, 25, 7, 3),
(9, 26, 8, 4),
(10, 28, 8, 4),
(11, 30, 8, 4);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `citations`
--
ALTER TABLE `citations`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `docnames`
--
ALTER TABLE `docnames`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `docverzions`
--
ALTER TABLE `docverzions`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `errors`
--
ALTER TABLE `errors`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `citations`
--
ALTER TABLE `citations`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT a táblához `docnames`
--
ALTER TABLE `docnames`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT a táblához `docverzions`
--
ALTER TABLE `docverzions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT a táblához `errors`
--
ALTER TABLE `errors`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
