from dataclasses import dataclass

@dataclass
class User:
    user_id: str,
    username: str,
    email: str,
    password: str,
    credits: int,
    created_at: str

@dataclass
class Job:
    user_id: str,
    job_id: str,
    job_type: tuple(),
    state: tuple(),
    prompt: str,
    data: str | None,
    estimated_cost: int,
    actual_cost: int,
    created_at: str,
    completed_at: str




def templateDatabaseDelete(client, table, column, identifier) -> 0|1:
    result = client.prepare(f`DELETE FROM {table} WHERE {identifier} = ?`).run(identifier)
    if !result return 1
    return 0
