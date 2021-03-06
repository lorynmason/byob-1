const players = require('../../data/mock-players-data');
const teams = require('../../data/mock-team-data');

const createTeam = (knex, team) => {
  return knex('teams')
    .insert({
      team_name: team.team_name,
      head_coach: team.head_coach,
      owner: team.owner,
      most_recent_championship: team.most_recent_championship,
      defensive_rating: team.defensive_rating,
      points_per_game: team.points_per_game
    }, ['id', 'team_name'])
      .then((returns) => {
        let playerPromises = [];

      const filteredPlayers = players.filter((player) => {
        return returns[0].team_name === player.team;
      });

      filteredPlayers.forEach((player) => {
        playerPromises.push(
          createPlayer(knex, {
            name: player.name,
            team: player.team, 
            games_played: player.games_played, 
            points_per_game: player.points_per_game, 
            field_goal_percentage: player.field_goal_percentage,
            three_point_percentage: player.three_point_percentage, 
            free_throw_percentage: player.free_throw_percentage,
            rebounds_per_game: player.rebounds_per_game,
            assists_per_game: player.assists_per_game, 
            steals_per_game: player.steals_per_game, 
            blocks_per_game: player.blocks_per_game,
            team_id: returns[0].id
          })
        );
      })

      return Promise.all(playerPromises);
    });
}

const createPlayer = (knex, player) => {
  return knex('players').insert(player);
}

exports.seed = (knex, Promise) => {
  return knex('players').del()
    .then(() => knex('teams').del())
    .then(() => {
      let teamPromises = [];

      teams.forEach((team) => {
        teamPromises.push(createTeam(knex, team));
      });

      return Promise.all(teamPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
