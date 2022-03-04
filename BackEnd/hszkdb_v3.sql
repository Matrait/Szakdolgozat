-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2022. Feb 08. 19:11
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
-- Adatbázis: `hszkdb_v3`
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
-- Tábla szerkezet ehhez a táblához `docnames`
--

CREATE TABLE `docnames` (
  `ID` int(11) NOT NULL,
  `DocName` varchar(200) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Tábla szerkezet ehhez a táblához `docverzions`
--

CREATE TABLE `docverzions` (
  `ID` int(11) NOT NULL,
  `DocID` int(11) NOT NULL,
  `vName` varchar(256) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
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
