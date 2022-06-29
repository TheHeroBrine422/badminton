USE badminton;
DROP TABLE IF EXISTS `games`;
CREATE TABLE games (
                        id INT NOT NULL AUTO_INCREMENT,
                        team1Name VARCHAR(512) NOT NULL,
                        team2Name VARCHAR(512) NOT NULL,
                        team1Score INT NOT NULL,
                        team2Score INT NOT NULL,
                        winner INT NOT NULL,
                        submissiontime DATETIME DEFAULT now(),
                        PRIMARY KEY ( id )
);
