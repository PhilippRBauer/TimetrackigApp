-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Erstellungszeit: 02. Jul 2022 um 15:22
-- Server-Version: 5.7.34
-- PHP-Version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Datenbank: time_tracking
--
DROP DATABASE IF EXISTS time_tracking;
CREATE DATABASE IF NOT EXISTS time_tracking DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE time_tracking;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `time_tracking`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `event`
--

CREATE TABLE `event` (
  `id` int(64) NOT NULL,
  `modification_date` datetime NOT NULL,
  `user` int(11) NOT NULL,
  `time` text NOT NULL,
  `typ` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `intervals`
--

CREATE TABLE `intervals` (
  `id` int(64) NOT NULL,
  `modification_date` datetime NOT NULL,
  `user` text NOT NULL,
  `project_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `von` datetime NOT NULL,
  `bis` datetime NOT NULL,
  `intervall` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `intervals`
--

INSERT INTO `intervals` (`id`, `modification_date`, `user`, `project_id`, `task_id`, `von`, `bis`, `intervall`) VALUES
(1, '2022-07-02 18:57:37', '1', 1, 1, '2022-06-02 12:33:00', '2022-06-02 18:57:00', '06:24:00'),
(2, '2022-07-02 19:00:30', '2', 1, 2, '2022-06-06 14:00:00', '2022-06-06 18:23:00', '04:23:00'),
(3, '2022-07-02 18:57:37', '5', 1, 3, '2022-06-08 12:33:00', '2022-06-08 18:57:00', '05:44:00'),
(4, '2022-07-02 19:00:30', '3', 1, 3, '2022-06-12 14:00:00', '2022-06-12 18:23:00', '03:23:00'),
(5, '2022-07-02 18:57:37', '6', 1, 3, '2022-06-22 12:33:00', '2022-06-22 18:57:00', '04:24:00'),
(6, '2022-07-02 19:00:30', '4', 1, 4, '2022-06-26 14:00:00', '2022-06-26 18:23:00', '07:19:00'),
(7, '2022-07-02 18:57:37', '5', 1, 5, '2022-06-28 12:33:00', '2022-06-28 18:57:00', '02:12:00'),
(8, '2022-07-02 18:57:37', '1', 2, 6, '2022-06-02 12:33:00', '2022-06-02 18:57:00', '04:24:00'),
(9, '2022-07-02 19:00:30', '2', 2, 7, '2022-06-05 14:00:00', '2022-06-05 18:23:00', '03:19:00'),
(10, '2022-07-02 18:57:37', '3', 2, 8, '2022-06-08 12:33:00', '2022-06-08 18:57:00', '02:12:00'),
(11, '2022-07-02 18:57:37', '5', 3, 9, '2022-06-02 12:33:00', '2022-06-02 18:57:00', '04:24:00'),
(12, '2022-07-02 18:57:37', '6', 3, 10, '2022-06-08 12:33:00', '2022-06-08 18:57:00', '01:12:00'),
(13, '2022-07-02 18:57:37', '5', 3, 10, '2022-06-12 12:33:00', '2022-06-12 18:57:00', '05:28:00'),
(14, '2022-07-02 18:57:37', '5', 4, 11, '2022-06-16 12:33:00', '2022-06-16 18:57:00', '06:12:00'),
(15, '2022-07-02 19:57:37', '5', 5, 14, '2022-07-02 10:00:00', '2022-07-02 18:00:00', '08:00:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `posting`
--

CREATE TABLE `posting` (
  `id` int(64) NOT NULL,
  `modification_date` datetime NOT NULL,
  `user` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `project`
--

CREATE TABLE `project` (
  `id` int(64) NOT NULL,
  `modification_date` datetime NOT NULL,
  `description` text NOT NULL,
  `client` text NOT NULL,
  `duration` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `project`
--

INSERT INTO `project` (`id`, `modification_date`, `description`, `client`, `duration`) VALUES
(1, '2022-07-02 18:39:59', 'Software Praktikum', 'Hochschule der Medien', '820:00:00'),
(2, '2022-07-02 18:44:21', 'Qualitätsmanagement System', 'Trumpf', '240:00:00'),
(3, '2022-07-02 18:47:19', 'Zufriedenheitsbefragung', 'Deutsche Bahn AG', '56:00:00'),
(4, '2022-07-02 18:49:26', 'Preispositionierung', 'Apple', '128:00:00'),
(5, '2022-07-02 18:49:26', 'Abwesenheit', 'BetterTrack', '00:00:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `project_user_reference`
--

CREATE TABLE `project_user_reference` (
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `project_user_reference`
--

INSERT INTO `project_user_reference` (`project_id`, `user_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(4, 5),
(4, 3),
(4, 2),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(5, 5),
(5, 6);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `task`
--

CREATE TABLE `task` (
  `id` int(64) NOT NULL,
  `modification_date` datetime NOT NULL,
  `capacity` int(11) NOT NULL,
  `project` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `task`
--

INSERT INTO `task` (`id`, `modification_date`, `capacity`, `project`, `user`, `description`) VALUES
(1, '2022-07-02 18:41:09', 5, 1, 0, 'Use Cases erstellen'),
(2, '2022-07-02 18:41:41', 10, 1, 0, 'Klassendiagramm erstellen'),
(3, '2022-07-02 18:42:23', 50, 1, 0, 'Programmieren'),
(4, '2022-07-02 18:42:37', 20, 1, 0, 'Testing'),
(5, '2022-07-02 18:42:57', 1, 1, 0, 'Vorstellung des Systems'),
(6, '2022-07-02 18:45:30', 8, 2, 0, 'Pilotworkshop durchführen'),
(7, '2022-07-02 18:46:00', 20, 2, 0, 'Bestandsaufnahme '),
(8, '2022-07-02 18:46:26', 10, 2, 0, 'Anforderungsanalyse'),
(9, '2022-07-02 18:47:40', 20, 3, 0, 'Datenergebung'),
(10, '2022-07-02 18:48:26', 25, 3, 0, 'Ergebnisauswertung'),
(11, '2022-07-02 18:50:33', 5, 4, 0, 'Produktanalyse und Evaluation'),
(12, '2022-07-02 18:50:56', 4, 4, 0, 'Bewertung und Empfehlung'),
(13, '2022-07-02 18:48:26', 0, 5, 0, 'Pause'),
(14, '2022-07-02 18:48:26', 0, 5, 0, 'Krankheit'),
(15, '2022-07-02 18:48:26', 0, 5, 0, 'Urlaub');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `timeaccount`
--

CREATE TABLE `timeaccount` (
  `id` int(64) NOT NULL,
  `modification_date` datetime NOT NULL,
  `user` int(11) NOT NULL,
  `project` int(11) NOT NULL,
  `working_time` float NOT NULL,
  `task` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `id` int(64) NOT NULL,
  `modification_date` datetime NOT NULL,
  `firstname` text NOT NULL,
  `lastname` text NOT NULL,
  `email` text NOT NULL,
  `username` text NOT NULL,
  `guid` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `modification_date`, `firstname`, `lastname`, `email`, `username`, `guid`) VALUES
(1, '2022-06-02 11:51:02', 'Paulina', 'Sunke', 'paulina.sunke3@gmail.com', 'paulinasunke', 'paulina.sunke3@gmail.com'),
(2, '2022-06-15 11:51:33', 'Philipp', 'Bauer', 'raybauer7@googlemail.com', 'philippbauer', 'raybauer7@googlemail.com'),
(3, '2022-06-14 11:52:05', 'Justyna', 'Angermaier', 'justyna.angermaier@gmail.com', 'justynaangermaier', 'justyna.angermaier@gmail.com'),
(4, '2022-06-14 11:53:02', 'Fabian', 'Gote', 'gotefabian7@gmail.com', 'fabiangote', 'gotefabian7@gmail.com'),
(5, '2022-07-02 19:02:46', 'Lea', 'Ernst', 'leaernst99@gmail.com', 'leaernst', 'birAGRTmI5UyQ7yBMapLlGimssE3'),
(6, '2022-06-14 11:54:13', 'Elena', 'Hammer', 'elena.hammer27@gmail.com', 'elenahammer', 'elena.hammer27@gmail.com');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `intervals`
--
ALTER TABLE `intervals`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `posting`
--
ALTER TABLE `posting`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `timeaccount`
--
ALTER TABLE `timeaccount`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;