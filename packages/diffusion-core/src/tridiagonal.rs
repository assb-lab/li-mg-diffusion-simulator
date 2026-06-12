pub fn solve_tridiagonal(
    lower: &[f64],
    diag: &[f64],
    upper: &[f64],
    rhs: &[f64],
) -> Result<Vec<f64>, String> {
    let n = diag.len();
    if n == 0 || lower.len() != n - 1 || upper.len() != n - 1 || rhs.len() != n {
        return Err("invalid tridiagonal dimensions".to_string());
    }

    let mut c_prime = vec![0.0; n - 1];
    let mut d_prime = vec![0.0; n];
    let mut solution = vec![0.0; n];

    let denom = diag[0];
    if denom.abs() < 1e-30 {
        return Err("singular tridiagonal matrix".to_string());
    }
    c_prime[0] = upper[0] / denom;
    d_prime[0] = rhs[0] / denom;

    for i in 1..n {
        let denom = diag[i] - lower[i - 1] * c_prime[i - 1];
        if denom.abs() < 1e-30 {
            return Err("singular tridiagonal matrix".to_string());
        }
        if i < n - 1 {
            c_prime[i] = upper[i] / denom;
        }
        d_prime[i] = (rhs[i] - lower[i - 1] * d_prime[i - 1]) / denom;
    }

    solution[n - 1] = d_prime[n - 1];
    for i in (0..n - 1).rev() {
        solution[i] = d_prime[i] - c_prime[i] * solution[i + 1];
    }

    Ok(solution)
}
